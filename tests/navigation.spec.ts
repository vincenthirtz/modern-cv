import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Tests de navigation entre pages.
 *
 * Objectif : détecter les erreurs "removeChild" et autres TypeError
 * qui apparaissent lors de la navigation client-side via le menu.
 */

// Toutes les routes accessibles depuis le menu desktop
const NAV_LINKS = [
  { label: "Projets", href: "/projects" },
  { label: "Expérience", href: "/experience" },
  { label: "Communauté", href: "/community" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/contact" },
];

// Routes supplémentaires accessibles depuis le footer ou la homepage
const EXTRA_ROUTES = ["/cv", "/branding", "/expertise"];

/** Collecte les erreurs console pendant une action */
function collectErrors(page: Page) {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  };
  page.on("console", handler);

  // Capture aussi les erreurs JS non attrapées
  const uncaughtHandler = (err: Error) => {
    errors.push(`[uncaught] ${err.message}`);
  };
  page.on("pageerror", uncaughtHandler);

  return {
    errors,
    stop() {
      page.off("console", handler);
      page.off("pageerror", uncaughtHandler);
    },
  };
}

function hasRemoveChildError(errors: string[]): string | undefined {
  return errors.find(
    (e) => e.includes("removeChild") || e.includes("insertBefore") || e.includes("removeNode"),
  );
}

/** Détecte n'importe quelle erreur React/DOM bloquante. */
function hasBlockingError(errors: string[]): string | undefined {
  return errors.find(
    (e) =>
      e.includes("removeChild") ||
      e.includes("insertBefore") ||
      e.includes("removeNode") ||
      e.includes("Minified React error") ||
      e.includes("Hydration failed") ||
      e.includes("Hydration mismatch") ||
      e.includes("[uncaught]"),
  );
}

/** Vérifie qu'une page a bien fini de charger (plus d'état role="status"). */
async function expectMainVisible(page: Page) {
  const main = page.locator("main").first();
  await main.waitFor({ state: "attached", timeout: 5_000 });

  // Attendre que le <main> ne soit plus en état "loading"
  await expect
    .poll(async () => (await main.getAttribute("role")) !== "status", { timeout: 5_000 })
    .toBe(true);

  // Après chargement, au moins un heading visible
  const heading = page.locator("main h1, main h2").first();
  await heading.waitFor({ state: "attached", timeout: 5_000 });
}

// =============================================================================
// Test 1 : Navigation séquentielle — cliquer sur chaque lien du menu un par un
// =============================================================================
test("navigation séquentielle via le menu desktop ne produit aucune erreur removeChild", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const link of NAV_LINKS) {
    // Clic sur le lien du menu desktop
    await page.click(`nav >> a[href="${link.href}"]`);
    await page.waitForURL(`**${link.href}`);
    await page.waitForLoadState("networkidle");

    // Vérifier qu'on est sur la bonne page
    expect(page.url()).toContain(link.href);

    // Vérifier qu'il n'y a pas d'erreur removeChild
    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur après navigation vers ${link.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 2 : Aller-retour rapide — homepage → page → homepage → autre page
// =============================================================================
test("aller-retour rapide homepage ↔ pages ne crashe pas", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const link of NAV_LINKS) {
    // Aller vers la page
    await page.click(`nav >> a[href="${link.href}"]`);
    await page.waitForURL(`**${link.href}`);
    await page.waitForTimeout(300);

    // Retour à la homepage via le logo
    await page.click('a[aria-label="Accueil"]');
    await page.waitForURL("/");
    await page.waitForTimeout(300);

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur lors de l'aller-retour avec ${link.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 3 : Navigation directe entre sous-pages (sans passer par la homepage)
// =============================================================================
test("navigation directe entre sous-pages ne produit aucune erreur", async ({ page }) => {
  await page.goto("/projects");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  // Projets → Expérience → Communauté → Notes → Contact
  const sequence = NAV_LINKS.map((l) => l.href);

  for (let i = 1; i < sequence.length; i++) {
    await page.click(`nav >> a[href="${sequence[i]}"]`);
    await page.waitForURL(`**${sequence[i]}`);
    await page.waitForTimeout(200);

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur en naviguant de ${sequence[i - 1]} vers ${sequence[i]}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 4 : Navigation rapide (clics multiples sans attendre le chargement)
// =============================================================================
test("clics rapides enchaînés ne provoquent pas de crash", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  // Cliquer rapidement sur plusieurs liens sans attendre
  for (const link of NAV_LINKS) {
    await page.click(`nav >> a[href="${link.href}"]`, { noWaitAfter: true });
    await page.waitForTimeout(100); // Très court — simule un utilisateur rapide
  }

  // Attendre que la dernière navigation se stabilise
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const err = hasRemoveChildError(collector.errors);
  expect(err, "Erreur après clics rapides enchaînés").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 5 : Toutes les routes (y compris footer) — visite complète
// =============================================================================
test("visite de toutes les routes via navigation client-side", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const allRoutes = [...NAV_LINKS.map((l) => l.href), ...EXTRA_ROUTES];

  for (const route of allRoutes) {
    // Naviguer via JS pour forcer le client-side routing
    await page.evaluate((r) => {
      window.history.pushState({}, "", r);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, route);
    await page.waitForTimeout(500);

    // Alternative : naviguer via le router Next.js directement
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur sur la route ${route}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 6 : Browser back/forward — vérifier que l'historique ne crashe pas
// =============================================================================
test("browser back/forward ne produit pas d'erreur removeChild", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  // Naviguer sur 3 pages
  await page.click('nav >> a[href="/projects"]');
  await page.waitForURL("**/projects");
  await page.waitForTimeout(300);

  await page.click('nav >> a[href="/experience"]');
  await page.waitForURL("**/experience");
  await page.waitForTimeout(300);

  await page.click('nav >> a[href="/notes"]');
  await page.waitForURL("**/notes");
  await page.waitForTimeout(300);

  // Back × 2
  await page.goBack();
  await page.waitForTimeout(500);
  await page.goBack();
  await page.waitForTimeout(500);

  // Forward × 2
  await page.goForward();
  await page.waitForTimeout(500);
  await page.goForward();
  await page.waitForTimeout(500);

  const err = hasRemoveChildError(collector.errors);
  expect(err, "Erreur lors de back/forward").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 7 : Chaque lien desktop affiche un <main> visible et met à jour le titre
// =============================================================================
test("chaque lien du menu desktop mène à une page rendue correctement", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const collector = collectErrors(page);

  for (const link of NAV_LINKS) {
    await page.click(`nav >> a[href="${link.href}"]`);
    await page.waitForURL(`**${link.href}`);
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur bloquante après navigation vers ${link.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 8 : Navigation via les liens du footer
// =============================================================================
test("les liens du footer naviguent sans erreur", async ({ page }) => {
  const footerLinks = [...NAV_LINKS.map((l) => l.href), "/cv", "/branding"];

  const collector = collectErrors(page);

  for (const href of footerLinks) {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroller jusqu'au footer puis cliquer
    const footerLink = page.locator(`footer >> a[href="${href}"]`).first();
    await footerLink.scrollIntoViewIfNeeded();
    await footerLink.click();
    await page.waitForURL(`**${href}`);
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);
    expect(page.url()).toContain(href);

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur via le footer sur ${href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 9 : Retour à l'accueil via le logo depuis chaque page
// =============================================================================
test("le logo VH ramène à l'accueil depuis chaque page", async ({ page }) => {
  const collector = collectErrors(page);

  for (const link of NAV_LINKS) {
    await page.goto(link.href);
    await page.waitForLoadState("networkidle");

    await page.click('nav a[aria-label="Accueil"]');
    await page.waitForURL("http://localhost:3000/");
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);
    expect(new URL(page.url()).pathname).toBe("/");

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur après retour accueil depuis ${link.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 10 : Navigation au clavier (Tab + Enter) dans le menu desktop
// =============================================================================
test("navigation clavier dans le menu desktop fonctionne", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  // Focus direct sur le premier lien de nav puis Enter
  const firstLink = page.locator('nav a[href="/projects"]').first();
  await firstLink.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/projects");
  await expectMainVisible(page);

  const secondLink = page.locator('nav a[href="/experience"]').first();
  await secondLink.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/experience");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur pendant la navigation clavier").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 11 : Rechargement (F5) sur chaque sous-page conserve la route
// =============================================================================
test("rechargement de chaque sous-page fonctionne", async ({ page }) => {
  const collector = collectErrors(page);

  for (const link of NAV_LINKS) {
    await page.goto(link.href);
    await page.waitForLoadState("networkidle");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);
    expect(new URL(page.url()).pathname).toBe(link.href);

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur après reload sur ${link.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// Test 12 : Notes → article → retour à l'index
// =============================================================================
test("navigation vers un article depuis /notes puis retour", async ({ page }) => {
  await page.goto("/notes");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const collector = collectErrors(page);

  // Trouver le premier lien interne vers /notes/<slug>
  const articleLink = page.locator('a[href^="/notes/"]').first();
  await expect(articleLink).toBeVisible();
  const href = await articleLink.getAttribute("href");
  expect(href).toBeTruthy();

  await articleLink.click();
  await page.waitForURL(`**${href}`);
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  // Retour via back
  await page.goBack();
  await page.waitForURL("**/notes");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur lors de la navigation article").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 13 : Cliquer deux fois de suite sur le même lien ne crashe pas
// =============================================================================
test("double-clic sur le même lien de nav ne crashe pas", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const projectsLink = page.locator('nav a[href="/projects"]').first();
  await projectsLink.click();
  await page.waitForURL("**/projects");
  await projectsLink.click();
  await page.waitForTimeout(300);

  await expectMainVisible(page);
  expect(new URL(page.url()).pathname).toBe("/projects");

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après double-clic").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 14 : Mix menu + bouton back sur une séquence profonde
// =============================================================================
test("séquence mixte menu/back sur 5 pages ne casse pas l'historique", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const sequence = ["/projects", "/experience", "/community", "/notes", "/contact"];

  for (const href of sequence) {
    await page.click(`nav >> a[href="${href}"]`);
    await page.waitForURL(`**${href}`);
    await page.waitForTimeout(200);
  }

  // Back en arrière jusqu'à l'accueil
  for (let i = 0; i < sequence.length; i++) {
    await page.goBack();
    await page.waitForTimeout(300);
    await expectMainVisible(page);
  }

  expect(new URL(page.url()).pathname).toBe("/");

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur pendant la séquence mixte").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 15 : Menu mobile — ouverture, navigation, fermeture automatique
// =============================================================================
test.describe("menu mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("ouverture du burger puis navigation via un lien ferme le menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const collector = collectErrors(page);

    // Ouvrir le burger
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");

    // Cliquer sur un lien du menu mobile
    const menu = page.locator("#mobile-nav-menu");
    await menu.locator('a[href="/projects"]').click();
    await page.waitForURL("**/projects");
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);

    // Le burger doit être revenu à aria-expanded="false"
    await expect(burger).toHaveAttribute("aria-expanded", "false");

    const err = hasBlockingError(collector.errors);
    expect(err, "Erreur dans le menu mobile").toBeUndefined();

    collector.stop();
  });

  test("Escape ferme le menu mobile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(burger).toHaveAttribute("aria-expanded", "false");
  });

  test("les 5 liens mobiles naviguent sans erreur", async ({ page }) => {
    const collector = collectErrors(page);

    for (const link of NAV_LINKS) {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
      await burger.click();
      await page.locator(`#mobile-nav-menu a[href="${link.href}"]`).click();
      await page.waitForURL(`**${link.href}`);
      await page.waitForLoadState("networkidle");
      await expectMainVisible(page);

      const err = hasBlockingError(collector.errors);
      expect(err, `Erreur menu mobile → ${link.href}`).toBeUndefined();
    }

    collector.stop();
  });
});

// =============================================================================
// Test 16 : Route inconnue → not-found → retour au site
// =============================================================================
test("une route inconnue renvoie une page not-found utilisable", async ({ page }) => {
  const response = await page.goto("/cette-page-n-existe-pas-vraiment");
  expect(response?.status()).toBe(404);
  await page.waitForLoadState("networkidle");

  // Depuis la page 404, la nav doit toujours être utilisable
  const homeLink = page.locator('nav a[aria-label="Accueil"]').first();
  await expect(homeLink).toBeVisible();
  await homeLink.click();
  await page.waitForURL("http://localhost:3000/");
  await expectMainVisible(page);
});

// =============================================================================
// Test 17 : Cmd/Ctrl+clic ouvre un nouvel onglet sans casser la page courante
// =============================================================================
test("Cmd+clic sur un lien de nav ouvre un nouvel onglet", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.click('nav >> a[href="/projects"]', { modifiers: ["Meta"] }),
  ]);

  await newPage.waitForLoadState("networkidle");
  expect(newPage.url()).toContain("/projects");

  // La page d'origine doit toujours être sur /
  expect(new URL(page.url()).pathname).toBe("/");

  await newPage.close();

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après ouverture nouvel onglet").toBeUndefined();

  collector.stop();
});

// =============================================================================
// Test 18 : Stress — 3 allers-retours rapides sur toutes les pages de suite
// =============================================================================
test("stress navigation : 3 boucles sur toutes les pages", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (let i = 0; i < 3; i++) {
    for (const link of NAV_LINKS) {
      await page.click(`nav >> a[href="${link.href}"]`);
      await page.waitForURL(`**${link.href}`);
      await page.waitForTimeout(100);
    }
    await page.click('nav a[aria-label="Accueil"]');
    await page.waitForURL("http://localhost:3000/");
    await page.waitForTimeout(100);
  }

  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après stress test").toBeUndefined();

  collector.stop();
});

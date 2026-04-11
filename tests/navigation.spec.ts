import { test, expect, type ConsoleMessage } from "@playwright/test";

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
function collectErrors(page: import("@playwright/test").Page) {
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

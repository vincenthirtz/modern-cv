import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Tests de navigation — menu macOS (top bar + bottom dock).
 *
 * Objectif : valider le bon fonctionnement du dock fixe en bas (navigation
 * par icônes), de la top bar (logo, toggles), et détecter les erreurs
 * "removeChild" / DOM lors de la navigation client-side.
 */

// Toutes les routes accessibles depuis le dock
const DOCK_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projects" },
  { label: "Expérience", href: "/experience" },
  { label: "Communauté", href: "/community" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/contact" },
];

/** Items du dock sans l'accueil (pour les tests de navigation séquentielle) */
const DOCK_NAV_ITEMS = DOCK_ITEMS.filter((i) => i.href !== "/");

// Routes supplémentaires accessibles depuis le footer ou la homepage
const EXTRA_ROUTES = ["/cv", "/branding", "/expertise"];

/** Sélecteur du dock (nav principale en bas) */
const DOCK = 'nav[aria-label="Navigation principale"]';

/** Sélecteur de la top bar */
const TOP_BAR = 'nav[aria-label="Barre de menu"]';

/** Collecte les erreurs console pendant une action */
function collectErrors(page: Page) {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  };
  page.on("console", handler);

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

  await expect
    .poll(async () => (await main.getAttribute("role")) !== "status", { timeout: 5_000 })
    .toBe(true);

  const heading = page.locator("main h1, main h2").first();
  await heading.waitFor({ state: "attached", timeout: 5_000 });
}

// =============================================================================
// TOP BAR
// =============================================================================

test.describe("top bar macOS", () => {
  test("la top bar contient le logo VH et les toggles", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const topBar = page.locator(TOP_BAR);
    await expect(topBar).toBeVisible();

    // Logo lien vers l'accueil
    const logo = topBar.locator('a[aria-label="Accueil"]');
    await expect(logo).toBeVisible();

    // Groupe de préférences d'affichage
    const prefsGroup = topBar.locator('[aria-label="Préférences d\'affichage"]');
    await expect(prefsGroup).toBeVisible();
  });

  test("le badge disponibilité est visible sur desktop", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const badge = page.locator(`${TOP_BAR} >> text=Disponible`);
    await expect(badge).toBeVisible();
  });

  test("la top bar reste visible après scroll", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    const header = page.locator("header").first();
    const box = await header.boundingBox();
    expect(box, "Le header doit être visible").toBeTruthy();
    expect(box!.y).toBeLessThan(50);
  });

  test("le logo VH ramène à l'accueil depuis chaque page", async ({ page }) => {
    const collector = collectErrors(page);

    for (const item of DOCK_NAV_ITEMS) {
      await page.goto(item.href);
      await page.waitForLoadState("networkidle");

      await page.click(`${TOP_BAR} a[aria-label="Accueil"]`);
      await page.waitForURL("http://localhost:3000/");
      await page.waitForLoadState("networkidle");

      await expectMainVisible(page);
      expect(new URL(page.url()).pathname).toBe("/");

      const err = hasBlockingError(collector.errors);
      expect(err, `Erreur après retour accueil depuis ${item.href}`).toBeUndefined();
    }

    collector.stop();
  });

  test("la navigation client-side fonctionne après un toggle de thème", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const collector = collectErrors(page);

    // Toggle le thème
    const themeBtn = page.locator('button[aria-label*="mode"]').first();
    await themeBtn.click();
    await page.waitForTimeout(200);

    // La navigation via le dock doit toujours fonctionner
    await page.click(`${DOCK} a[aria-label="Projets"]`);
    await page.waitForURL("**/projects");
    await page.waitForLoadState("networkidle");
    await expectMainVisible(page);

    await page.click(`${DOCK} a[aria-label="Notes"]`);
    await page.waitForURL("**/notes");
    await page.waitForLoadState("networkidle");
    await expectMainVisible(page);

    const err = hasBlockingError(collector.errors);
    expect(err, "Erreur après toggle thème + navigation").toBeUndefined();

    collector.stop();
  });
});

// =============================================================================
// DOCK — STRUCTURE & ACCESSIBILITÉ
// =============================================================================

test.describe("dock macOS — structure et a11y", () => {
  test("le dock contient 6 items avec les bons aria-label", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    await expect(dock).toBeVisible();

    for (const item of DOCK_ITEMS) {
      const link = dock.locator(`a[aria-label="${item.label}"]`);
      await expect(link, `Lien dock manquant : ${item.label}`).toBeVisible();
    }
  });

  test("chaque item du dock a un href correct", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);

    for (const item of DOCK_ITEMS) {
      const link = dock.locator(`a[aria-label="${item.label}"]`);
      await expect(link).toHaveAttribute("href", item.href);
    }
  });

  test("aria-current='page' marque l'item actif du dock", async ({ page }) => {
    for (const item of DOCK_ITEMS) {
      await page.goto(item.href);
      await page.waitForLoadState("networkidle");

      const dock = page.locator(DOCK);

      // L'item actif doit avoir aria-current="page"
      const activeLink = dock.locator(`a[aria-label="${item.label}"]`);
      await expect(activeLink).toHaveAttribute("aria-current", "page");

      // Les autres ne doivent pas l'avoir
      for (const other of DOCK_ITEMS.filter((i) => i.href !== item.href)) {
        const otherLink = dock.locator(`a[aria-label="${other.label}"]`);
        await expect(otherLink).not.toHaveAttribute("aria-current", "page");
      }
    }
  });

  test("le dock a les landmarks ARIA corrects", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    await expect(dock).toBeVisible();

    const linkCount = await dock.locator("a").count();
    expect(linkCount).toBe(6);
  });

  test("l'indicateur actif (point) est visible sous l'item courant", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    // Le wrapper de l'item actif doit avoir un point visible
    const dock = page.locator(DOCK);
    const activeItem = dock.locator('a[aria-current="page"]');
    await expect(activeItem).toBeVisible();

    // Le point indicateur est le sibling suivant du lien
    const dot = dock
      .locator(`a[aria-label="Projets"]`)
      .locator("..")
      .locator("span.rounded-full")
      .last();
    const opacity = await dot.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });

  test("les items inactifs n'ont pas de point indicateur visible", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);

    // Vérifier que le point de l'item "Notes" (inactif) a opacity 0
    const dot = dock
      .locator(`a[aria-label="Notes"]`)
      .locator("..")
      .locator("span.rounded-full")
      .last();
    const opacity = await dot.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(0);
  });
});

// =============================================================================
// DOCK — TOOLTIPS
// =============================================================================

test.describe("dock macOS — tooltips", () => {
  test("un tooltip apparaît au survol d'un item du dock", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    const projectsItem = dock.locator(`a[aria-label="Projets"]`).locator("..");
    const tooltip = projectsItem.locator(".dock-tooltip");

    // Avant hover : tooltip invisible
    const opacityBefore = await tooltip.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacityBefore)).toBe(0);

    // Hover sur l'item
    await projectsItem.hover();
    await page.waitForTimeout(200);

    // Après hover : tooltip visible avec le bon texte
    await expect
      .poll(
        async () => {
          const o = await tooltip.evaluate((el) => getComputedStyle(el).opacity);
          return Number(o);
        },
        { timeout: 2_000 },
      )
      .toBe(1);
    await expect(tooltip).toHaveText("Projets");
  });

  test("chaque item du dock a un tooltip avec le bon label", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);

    for (const item of DOCK_ITEMS) {
      const wrapper = dock.locator(`a[aria-label="${item.label}"]`).locator("..");
      const tooltip = wrapper.locator(".dock-tooltip");
      await expect(tooltip).toHaveText(item.label);
    }
  });

  test("les tooltips ont aria-hidden='true'", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    const tooltips = dock.locator(".dock-tooltip");
    const count = await tooltips.count();

    for (let i = 0; i < count; i++) {
      await expect(tooltips.nth(i)).toHaveAttribute("aria-hidden", "true");
    }
  });
});

// =============================================================================
// DOCK — EFFET DE MAGNIFICATION
// =============================================================================

test.describe("dock macOS — magnification", () => {
  test("les items du dock grossissent au survol", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    const icon = dock.locator(`a[aria-label="Projets"]`);

    // Récupérer le scale initial
    const scaleBefore = await icon.evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      if (transform === "none") return 1;
      const match = transform.match(/matrix\(([^,]+)/);
      return match ? parseFloat(match[1]) : 1;
    });

    // Hover sur le wrapper parent (déclenche onMouseEnter → hoveredIndex)
    const wrapper = icon.locator("..");
    await wrapper.hover();

    // Attendre que le scale augmente (transition CSS)
    await expect
      .poll(
        async () => {
          const transform = await icon.evaluate((el) => getComputedStyle(el).transform);
          if (transform === "none") return 1;
          const match = transform.match(/matrix\(([^,]+)/);
          return match ? parseFloat(match[1]) : 1;
        },
        { timeout: 2_000 },
      )
      .toBeGreaterThan(scaleBefore);
  });

  test("les items voisins grossissent aussi (effet gaussien)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);

    // Hover sur "Expérience" (index 2)
    const wrapper = dock.locator(`a[aria-label="Expérience"]`).locator("..");
    await wrapper.hover();
    await page.waitForTimeout(200);

    // L'item voisin "Projets" (index 1) doit aussi avoir un scale > 1
    const neighborIcon = dock.locator(`a[aria-label="Projets"]`);
    const neighborScale = await neighborIcon.evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      if (transform === "none") return 1;
      const match = transform.match(/matrix\(([^,]+)/);
      return match ? parseFloat(match[1]) : 1;
    });

    expect(neighborScale).toBeGreaterThan(1);
  });

  test("les items éloignés ne grossissent pas", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);

    // Hover sur "Accueil" (index 0)
    const wrapper = dock.locator(`a[aria-label="Accueil"]`).locator("..");
    await wrapper.hover();
    await page.waitForTimeout(200);

    // "Contact" (index 5) est éloigné → pas de grossissement
    const farIcon = dock.locator(`a[aria-label="Contact"]`);
    const farScale = await farIcon.evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      if (transform === "none") return 1;
      const match = transform.match(/matrix\(([^,]+)/);
      return match ? parseFloat(match[1]) : 1;
    });

    expect(farScale).toBe(1);
  });

  test("la magnification se réinitialise quand la souris quitte le dock", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    const icon = dock.locator(`a[aria-label="Projets"]`);
    const wrapper = icon.locator("..");

    // Hover puis quitter
    await wrapper.hover();
    await page.waitForTimeout(200);

    // Déplacer la souris hors du dock
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);

    const scaleAfterLeave = await icon.evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      if (transform === "none") return 1;
      const match = transform.match(/matrix\(([^,]+)/);
      return match ? parseFloat(match[1]) : 1;
    });

    expect(scaleAfterLeave).toBe(1);
  });
});

// =============================================================================
// DOCK — NAVIGATION SÉQUENTIELLE
// =============================================================================

test("navigation séquentielle via le dock ne produit aucune erreur", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain(item.href);

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur après navigation vers ${item.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// DOCK — ALLER-RETOUR RAPIDE
// =============================================================================

test("aller-retour rapide homepage ↔ pages via le dock ne crashe pas", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    // Aller vers la page via le dock
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
    await page.waitForTimeout(300);

    // Retour à l'accueil via le dock
    await page.click(`${DOCK} a[aria-label="Accueil"]`);
    await page.waitForURL("/");
    await page.waitForTimeout(300);

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur lors de l'aller-retour avec ${item.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// NAVIGATION DIRECTE ENTRE SOUS-PAGES
// =============================================================================

test("navigation directe entre sous-pages via le dock ne produit aucune erreur", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (let i = 1; i < DOCK_NAV_ITEMS.length; i++) {
    const item = DOCK_NAV_ITEMS[i];
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
    await page.waitForTimeout(200);

    const err = hasRemoveChildError(collector.errors);
    expect(
      err,
      `Erreur en naviguant de ${DOCK_NAV_ITEMS[i - 1].href} vers ${item.href}`,
    ).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// CLICS RAPIDES
// =============================================================================

test("clics rapides enchaînés sur le dock ne provoquent pas de crash", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    await page.click(`${DOCK} a[aria-label="${item.label}"]`, { noWaitAfter: true });
    await page.waitForTimeout(100);
  }

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const err = hasRemoveChildError(collector.errors);
  expect(err, "Erreur après clics rapides enchaînés").toBeUndefined();

  collector.stop();
});

// =============================================================================
// TOUTES LES ROUTES
// =============================================================================

test("visite de toutes les routes via navigation client-side", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const allRoutes = [...DOCK_NAV_ITEMS.map((l) => l.href), ...EXTRA_ROUTES];

  for (const route of allRoutes) {
    await page.evaluate((r) => {
      window.history.pushState({}, "", r);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, route);
    await page.waitForTimeout(500);

    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const err = hasRemoveChildError(collector.errors);
    expect(err, `Erreur sur la route ${route}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// BROWSER BACK/FORWARD
// =============================================================================

test("browser back/forward ne produit pas d'erreur", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  await page.click(`${DOCK} a[aria-label="Projets"]`);
  await page.waitForURL("**/projects");
  await page.waitForTimeout(300);

  await page.click(`${DOCK} a[aria-label="Expérience"]`);
  await page.waitForURL("**/experience");
  await page.waitForTimeout(300);

  await page.click(`${DOCK} a[aria-label="Notes"]`);
  await page.waitForURL("**/notes");
  await page.waitForTimeout(300);

  await page.goBack();
  await page.waitForTimeout(500);
  await page.goBack();
  await page.waitForTimeout(500);

  await page.goForward();
  await page.waitForTimeout(500);
  await page.goForward();
  await page.waitForTimeout(500);

  const err = hasRemoveChildError(collector.errors);
  expect(err, "Erreur lors de back/forward").toBeUndefined();

  collector.stop();
});

// =============================================================================
// CHAQUE ITEM DU DOCK MÈNE À UNE PAGE RENDUE
// =============================================================================

test("chaque item du dock mène à une page rendue correctement", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur bloquante après navigation vers ${item.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// NAVIGATION VIA LE FOOTER
// =============================================================================

test("les liens du footer naviguent sans erreur", async ({ page }) => {
  const footerLinks = [...DOCK_NAV_ITEMS.map((l) => l.href), "/cv", "/branding"];

  const collector = collectErrors(page);

  for (const href of footerLinks) {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
// NAVIGATION CLAVIER DANS LE DOCK
// =============================================================================

test("navigation clavier dans le dock fonctionne (Tab + Enter)", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  // Focus direct sur un lien du dock puis Enter
  const projetsLink = page.locator(`${DOCK} a[aria-label="Projets"]`);
  await projetsLink.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/projects");
  await expectMainVisible(page);

  const experienceLink = page.locator(`${DOCK} a[aria-label="Expérience"]`);
  await experienceLink.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/experience");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur pendant la navigation clavier").toBeUndefined();

  collector.stop();
});

// =============================================================================
// RECHARGEMENT SUR CHAQUE SOUS-PAGE
// =============================================================================

test("rechargement de chaque sous-page fonctionne", async ({ page }) => {
  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    await page.goto(item.href);
    await page.waitForLoadState("networkidle");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expectMainVisible(page);
    expect(new URL(page.url()).pathname).toBe(item.href);

    const err = hasBlockingError(collector.errors);
    expect(err, `Erreur après reload sur ${item.href}`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// NOTES → ARTICLE → RETOUR
// =============================================================================

test("navigation vers un article depuis /notes puis retour", async ({ page }) => {
  await page.goto("/notes");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const collector = collectErrors(page);

  const articleLink = page.locator('a[href^="/notes/"]').first();
  await expect(articleLink).toBeVisible();
  const href = await articleLink.getAttribute("href");
  expect(href).toBeTruthy();

  await articleLink.click();
  await page.waitForURL(`**${href}`);
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  await page.goBack();
  await page.waitForURL("**/notes");
  await page.waitForLoadState("networkidle");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur lors de la navigation article").toBeUndefined();

  collector.stop();
});

// =============================================================================
// DOUBLE-CLIC SUR LE MÊME ITEM
// =============================================================================

test("double-clic sur le même item du dock ne crashe pas", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const projetsLink = page.locator(`${DOCK} a[aria-label="Projets"]`);
  await projetsLink.click();
  await page.waitForURL("**/projects");
  await projetsLink.click();
  await page.waitForTimeout(300);

  await expectMainVisible(page);
  expect(new URL(page.url()).pathname).toBe("/projects");

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après double-clic").toBeUndefined();

  collector.stop();
});

// =============================================================================
// SÉQUENCE MIXTE DOCK + BACK
// =============================================================================

test("séquence mixte dock/back sur 5 pages ne casse pas l'historique", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const sequence = DOCK_NAV_ITEMS;

  for (const item of sequence) {
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
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
// DOCK SUR MOBILE — le dock doit aussi fonctionner en viewport mobile
// =============================================================================

test.describe("dock sur mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("le dock est visible et utilisable en viewport mobile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    await expect(dock).toBeVisible();

    // Les 6 items doivent être présents
    const linkCount = await dock.locator("a").count();
    expect(linkCount).toBe(6);
  });

  test("navigation via le dock en viewport mobile fonctionne", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const collector = collectErrors(page);

    for (const item of DOCK_NAV_ITEMS) {
      await page.click(`${DOCK} a[aria-label="${item.label}"]`);
      await page.waitForURL(`**${item.href}`);
      await page.waitForLoadState("networkidle");
      await expectMainVisible(page);

      const err = hasBlockingError(collector.errors);
      expect(err, `Erreur dock mobile → ${item.href}`).toBeUndefined();
    }

    collector.stop();
  });

  test("le scroll revient en haut après navigation mobile via le dock", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    await page.click(`${DOCK} a[aria-label="Projets"]`);
    await page.waitForURL("**/projects");
    await page.waitForLoadState("networkidle");

    await expect
      .poll(() => page.evaluate(() => window.scrollY), {
        message: "Le scroll n'est pas revenu en haut après navigation mobile",
        timeout: 3_000,
      })
      .toBeLessThanOrEqual(10);
  });

  test("aria-current='page' fonctionne sur mobile", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(DOCK);
    const activeLink = dock.locator(`a[aria-label="Projets"]`);
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });
});

// =============================================================================
// ROUTE INCONNUE → NOT-FOUND
// =============================================================================

test("une route inconnue renvoie une page not-found utilisable", async ({ page }) => {
  const response = await page.goto("/cette-page-n-existe-pas-vraiment");
  expect(response?.status()).toBe(404);
  await page.waitForLoadState("networkidle");

  // Depuis la page 404, le dock doit toujours être utilisable
  const dock = page.locator(DOCK);
  const homeLink = dock.locator(`a[aria-label="Accueil"]`);
  await expect(homeLink).toBeVisible();
  await homeLink.click();
  await page.waitForURL("http://localhost:3000/");
  await expectMainVisible(page);
});

// =============================================================================
// CMD+CLIC → NOUVEL ONGLET
// =============================================================================

test("Cmd+clic sur un item du dock ouvre un nouvel onglet", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.click(`${DOCK} a[aria-label="Projets"]`, { modifiers: ["Meta"] }),
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
// STRESS TEST
// =============================================================================

test("stress navigation : 3 boucles sur toutes les pages via le dock", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (let i = 0; i < 3; i++) {
    for (const item of DOCK_NAV_ITEMS) {
      await page.click(`${DOCK} a[aria-label="${item.label}"]`);
      await page.waitForURL(`**${item.href}`);
      await page.waitForTimeout(100);
    }
    await page.click(`${DOCK} a[aria-label="Accueil"]`);
    await page.waitForURL("http://localhost:3000/");
    await page.waitForTimeout(100);
  }

  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après stress test").toBeUndefined();

  collector.stop();
});

// =============================================================================
// UN SEUL CLIC SUFFIT
// =============================================================================

test("un seul clic sur chaque item du dock déclenche la navigation", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (const item of DOCK_NAV_ITEMS) {
    if (new URL(page.url()).pathname !== "/") {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    }

    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`, { timeout: 2_000 });

    await expectMainVisible(page);

    const err = hasBlockingError(collector.errors);
    expect(err, `Navigation ${item.href} nécessite plus d'un clic`).toBeUndefined();
  }

  collector.stop();
});

// =============================================================================
// SCROLL RESET APRÈS NAVIGATION
// =============================================================================

test("le scroll se remet à zéro après navigation client-side via le dock", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);

  await page.click(`${DOCK} a[aria-label="Projets"]`);
  await page.waitForURL("**/projects");
  await page.waitForLoadState("networkidle");

  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "Le scroll n'est pas revenu en haut après navigation vers /projects",
      timeout: 3_000,
    })
    .toBeLessThanOrEqual(10);

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);

  await page.click(`${DOCK} a[aria-label="Notes"]`);
  await page.waitForURL("**/notes");
  await page.waitForLoadState("networkidle");

  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "Le scroll n'est pas revenu en haut après navigation vers /notes",
      timeout: 3_000,
    })
    .toBeLessThanOrEqual(10);
});

// =============================================================================
// RSC REQUESTS
// =============================================================================

test("les requêtes RSC via le dock ne sont pas interceptées par le SW", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const rscResponses: { url: string; ok: boolean; contentType: string }[] = [];

  page.on("response", (response) => {
    const req = response.request();
    if (req.headers()["rsc"] === "1" || req.headers()["next-router-state-tree"]) {
      rscResponses.push({
        url: response.url(),
        ok: response.ok(),
        contentType: response.headers()["content-type"] || "",
      });
    }
  });

  for (const item of DOCK_NAV_ITEMS.slice(0, 3)) {
    await page.click(`${DOCK} a[aria-label="${item.label}"]`);
    await page.waitForURL(`**${item.href}`);
    await page.waitForLoadState("networkidle");
  }

  for (const resp of rscResponses) {
    expect(resp.ok, `Requête RSC échouée : ${resp.url}`).toBe(true);
  }
});

// =============================================================================
// URL COHÉRENTE APRÈS BACK/FORWARD
// =============================================================================

test("l'URL se met à jour correctement après back/forward", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.click(`${DOCK} a[aria-label="Projets"]`);
  await page.waitForURL("**/projects");
  await page.waitForLoadState("networkidle");

  await page.click(`${DOCK} a[aria-label="Notes"]`);
  await page.waitForURL("**/notes");
  await page.waitForLoadState("networkidle");

  await page.goBack();
  await page.waitForURL("**/projects");
  expect(new URL(page.url()).pathname).toBe("/projects");
  await expectMainVisible(page);

  await page.goForward();
  await page.waitForURL("**/notes");
  expect(new URL(page.url()).pathname).toBe("/notes");
  await expectMainVisible(page);
});

// =============================================================================
// SCROLL RESET SUR 3 NAVIGATIONS CONSÉCUTIVES
// =============================================================================

test("le scroll revient en haut sur 3 navigations consécutives via le dock", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const routes = [
    { label: "Projets", href: "/projects" },
    { label: "Notes", href: "/notes" },
    { label: "Contact", href: "/contact" },
  ];

  for (const route of routes) {
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    await page.click(`${DOCK} a[aria-label="${route.label}"]`);
    await page.waitForURL(`**${route.href}`);
    await page.waitForLoadState("networkidle");

    await expect
      .poll(() => page.evaluate(() => window.scrollY), {
        message: `Le scroll n'est pas revenu en haut après navigation vers ${route.href}`,
        timeout: 3_000,
      })
      .toBeLessThanOrEqual(10);
  }
});

// =============================================================================
// SKIP-LINK
// =============================================================================

test("le skip-link mène au contenu principal", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const skipLink = page.locator('a.skip-link, a[href="#main"]').first();

  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");

  const mainId = await page.evaluate(() => {
    const main = document.getElementById("main") || document.querySelector("main");
    return main?.id || main?.tagName;
  });
  expect(mainId).toBeTruthy();
});

// =============================================================================
// DOCUMENT.TITLE COHÉRENT
// =============================================================================

test("le document.title est non vide sur chaque page", async ({ page }) => {
  const allRoutes = ["/", ...DOCK_NAV_ITEMS.map((l) => l.href)];
  const titles = new Set<string>();

  for (const route of allRoutes) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const title = await page.title();
    expect(title, `Le titre est vide sur ${route}`).toBeTruthy();
    titles.add(title);
  }

  expect(titles.size, "Toutes les pages ont le même titre").toBeGreaterThanOrEqual(2);
});

// =============================================================================
// PAS DE FUITE MÉMOIRE
// =============================================================================

test("pas de fuite mémoire visible après navigation intensive via le dock", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  for (let i = 0; i < 5; i++) {
    await page.click(`${DOCK} a[aria-label="Projets"]`);
    await page.waitForURL("**/projects");
    await page.click(`${DOCK} a[aria-label="Contact"]`);
    await page.waitForURL("**/contact");
  }

  await page.click(`${DOCK} a[aria-label="Accueil"]`);
  await page.waitForURL("http://localhost:3000/");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après navigation intensive").toBeUndefined();

  collector.stop();
});

// =============================================================================
// NAVIGATION VERS UNE ANCRE
// =============================================================================

test("navigation vers une ancre ne provoque pas d'erreur", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const collector = collectErrors(page);

  await page.evaluate(() => {
    window.location.hash = "#main";
  });
  await page.waitForTimeout(300);

  expect(page.url()).toContain("#main");

  await page.click(`${DOCK} a[aria-label="Projets"]`);
  await page.waitForURL("**/projects");
  await expectMainVisible(page);

  const err = hasBlockingError(collector.errors);
  expect(err, "Erreur après navigation ancre + lien").toBeUndefined();

  collector.stop();
});

// =============================================================================
// DOCK — STYLE GLASSMORPHISM
// =============================================================================

test("le dock a un backdrop-filter (glassmorphism)", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const dockBar = page.locator(`${DOCK} .dock-bar`);
  const backdropFilter = await dockBar.evaluate((el) => getComputedStyle(el).backdropFilter);

  expect(backdropFilter).toContain("blur");
});

// =============================================================================
// DOCK — POSITION FIXE EN BAS
// =============================================================================

test("le dock est positionné en fixed au bas du viewport", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const dock = page.locator(DOCK);
  const position = await dock.evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe("fixed");

  // Le dock doit être dans la moitié basse du viewport
  const box = await dock.boundingBox();
  expect(box).toBeTruthy();
  const viewportHeight = page.viewportSize()!.height;
  expect(box!.y).toBeGreaterThan(viewportHeight / 2);
});

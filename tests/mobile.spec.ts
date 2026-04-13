import { test, expect } from "@playwright/test";

/**
 * Tests du responsive et du dock macOS en viewport mobile.
 */

/** Sélecteur du dock */
const DOCK = 'nav[aria-label="Navigation principale"]';

/** Sélecteur de la top bar */
const TOP_BAR = 'nav[aria-label="Barre de menu"]';

test.describe("Mobile — dock et responsive", () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("le dock est visible en mobile", async ({ page }) => {
    const dock = page.locator(DOCK);
    await expect(dock).toBeVisible();

    // Les 6 items sont présents
    const linkCount = await dock.locator("a").count();
    expect(linkCount).toBe(6);
  });

  test("la top bar est visible en mobile avec le logo", async ({ page }) => {
    const topBar = page.locator(TOP_BAR);
    await expect(topBar).toBeVisible();

    const logo = topBar.locator('a[aria-label="Accueil"]');
    await expect(logo).toBeVisible();
  });

  test("les items du dock ont les bons aria-label", async ({ page }) => {
    const dock = page.locator(DOCK);
    const labels = ["Accueil", "Projets", "Expérience", "Communauté", "Notes", "Contact"];

    for (const label of labels) {
      const link = dock.locator(`a[aria-label="${label}"]`);
      await expect(link, `Item dock manquant : ${label}`).toBeVisible();
    }
  });

  test("cliquer sur un item du dock navigue vers la bonne page", async ({ page }) => {
    const dock = page.locator(DOCK);

    await dock.locator('a[aria-label="Notes"]').click();
    await page.waitForURL("**/notes");

    expect(page.url()).toContain("/notes");
  });

  test("l'item actif du dock a aria-current='page' sur mobile", async ({ page }) => {
    const dock = page.locator(DOCK);

    // Sur la homepage, l'item Accueil est actif
    const homeLink = dock.locator('a[aria-label="Accueil"]');
    await expect(homeLink).toHaveAttribute("aria-current", "page");

    // Sur /projects, l'item Projets est actif
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const projetsLink = dock.locator('a[aria-label="Projets"]');
    await expect(projetsLink).toHaveAttribute("aria-current", "page");
    await expect(homeLink).not.toHaveAttribute("aria-current", "page");
  });

  test("les pages s'affichent correctement en viewport mobile", async ({ page }) => {
    const pages = ["/", "/projects", "/experience", "/notes", "/contact"];

    for (const path of pages) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);

      // Pas de scroll horizontal significatif (tolérance de 10px)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(
        overflow,
        `Scroll horizontal de ${overflow}px détecté sur ${path}`,
      ).toBeLessThanOrEqual(10);
    }
  });

  test("le dock reste en bas après scroll sur mobile", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    const dock = page.locator(DOCK);
    const box = await dock.boundingBox();
    expect(box).toBeTruthy();

    // Le dock doit être dans le bas du viewport
    const viewportHeight = page.viewportSize()!.height;
    expect(box!.y).toBeGreaterThan(viewportHeight / 2);
  });
});

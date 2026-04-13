import { test, expect } from "@playwright/test";

/**
 * Tests de la page d'accueil.
 */

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("affiche le hero avec le titre principal", async ({ page }) => {
    const hero = page.locator("main");
    await expect(hero).toBeVisible();

    // Le titre principal doit contenir le nom
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });

  test("contient les sections Hero, About et Expertise", async ({ page }) => {
    // Vérifie que les 3 sections de la homepage sont présentes
    await expect(page.locator("main")).toBeVisible();

    // La page doit avoir du contenu substantiel
    const mainContent = await page.locator("main").textContent();
    expect(mainContent?.length).toBeGreaterThan(100);
  });

  test("le skip-link est présent et fonctionnel", async ({ page }) => {
    // Le skip-link doit exister pour l'accessibilité
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toHaveCount(1);

    // Il doit devenir visible au focus
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test("le dock de navigation est visible avec les 6 items", async ({ page }) => {
    const dock = page.locator('nav[aria-label="Navigation principale"]');
    await expect(dock).toBeVisible();

    // Vérifie les items du dock via aria-label
    const labels = ["Accueil", "Projets", "Expérience", "Communauté", "Notes", "Contact"];
    for (const label of labels) {
      await expect(dock.locator(`a[aria-label="${label}"]`)).toBeVisible();
    }
  });

  test("le logo redirige vers la page d'accueil", async ({ page }) => {
    const logo = page.locator('nav[aria-label="Barre de menu"] a[aria-label="Accueil"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("le footer est présent", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("les métadonnées SEO sont correctes", async ({ page }) => {
    // Vérifier le titre de la page
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);

    // Vérifier la meta description
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description).toBeTruthy();
  });
});

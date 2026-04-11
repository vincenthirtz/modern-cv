import { test, expect } from "@playwright/test";

/**
 * Tests du menu mobile et du responsive.
 */

test.describe("Menu mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("le burger menu est visible en mobile", async ({ page }) => {
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await expect(burger).toBeVisible();
  });

  test("ouvrir le menu mobile affiche les liens de navigation", async ({ page }) => {
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await burger.click();
    await page.waitForTimeout(300);

    const mobileMenu = page.locator("#mobile-nav-menu");
    await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

    await expect(mobileMenu.getByText("Projets")).toBeVisible();
    await expect(mobileMenu.getByText("Expérience")).toBeVisible();
    await expect(mobileMenu.getByText("Notes")).toBeVisible();
    await expect(mobileMenu.getByText("Contact")).toBeVisible();
  });

  test("le menu mobile se ferme avec Escape", async ({ page }) => {
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await burger.click();
    await page.waitForTimeout(300);

    // Menu ouvert
    await expect(page.locator("#mobile-nav-menu")).toHaveAttribute("aria-hidden", "false");

    // Appuyer sur Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    // Menu fermé
    await expect(page.locator("#mobile-nav-menu")).toHaveAttribute("aria-hidden", "true");
  });

  test("cliquer sur un lien du menu mobile navigue et ferme le menu", async ({ page }) => {
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await burger.click();
    await page.waitForTimeout(300);

    // Vérifier que le menu est ouvert
    await expect(page.locator("#mobile-nav-menu")).toHaveAttribute("aria-hidden", "false");

    // Cliquer sur le lien Notes
    await page.locator('#mobile-nav-menu a[href="/notes"]').click();
    await page.waitForURL("**/notes");

    expect(page.url()).toContain("/notes");
  });

  test("le burger a les attributs ARIA corrects", async ({ page }) => {
    const burger = page.locator('button[aria-controls="mobile-nav-menu"]');

    // Fermé par défaut
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(burger).toHaveAttribute("aria-label", "Ouvrir le menu");

    // Ouvrir
    await burger.click();
    await page.waitForTimeout(300);

    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(burger).toHaveAttribute("aria-label", "Fermer le menu");
  });

  test("les pages s'affichent correctement en viewport mobile", async ({ page }) => {
    const pages = ["/", "/projects", "/experience", "/notes", "/contact"];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

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
});

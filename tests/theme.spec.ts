import { test, expect } from "@playwright/test";

/**
 * Tests du toggle de thème (dark/light) et du sélecteur d'accent.
 */

test.describe("Thème dark/light", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("le mode sombre est activé par défaut", async ({ page }) => {
    // Par défaut, pas de classe .light sur <html>
    const hasLight = await page.locator("html").evaluate((el) => el.classList.contains("light"));
    expect(hasLight).toBe(false);
  });

  test("le toggle de thème bascule en mode clair", async ({ page }) => {
    const toggle = page.locator('button[aria-label="Activer le mode clair"]');
    await expect(toggle).toBeVisible();

    await toggle.click();

    // Vérifie que la classe .light est ajoutée
    const hasLight = await page.locator("html").evaluate((el) => el.classList.contains("light"));
    expect(hasLight).toBe(true);

    // Le label du bouton doit changer
    await expect(page.locator('button[aria-label="Activer le mode sombre"]')).toBeVisible();
  });

  test("le thème persiste après rechargement", async ({ page }) => {
    // Basculer en mode clair
    await page.locator('button[aria-label="Activer le mode clair"]').click();

    // Recharger la page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Le mode clair doit persister
    const hasLight = await page.locator("html").evaluate((el) => el.classList.contains("light"));
    expect(hasLight).toBe(true);
  });

  test("double toggle revient au mode sombre", async ({ page }) => {
    // Dark → Light
    await page.locator('button[aria-label="Activer le mode clair"]').click();
    // Light → Dark
    await page.locator('button[aria-label="Activer le mode sombre"]').click();

    const hasLight = await page.locator("html").evaluate((el) => el.classList.contains("light"));
    expect(hasLight).toBe(false);
  });
});

test.describe("Sélecteur d'accent", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("le bouton d'accent est visible et ouvre la palette", async ({ page }) => {
    const accentButton = page.locator('button[aria-label="Changer la couleur d\'accentuation"]');
    await expect(accentButton).toBeVisible();

    await accentButton.click();

    // La palette doit s'afficher avec 5 couleurs
    const palette = page.locator('[role="radiogroup"]');
    await expect(palette).toBeVisible();

    const options = palette.locator('[role="radio"]');
    await expect(options).toHaveCount(5);
  });

  test("changer l'accent met à jour la CSS custom property", async ({ page }) => {
    // Ouvrir la palette
    await page.locator('button[aria-label="Changer la couleur d\'accentuation"]').click();

    // Cliquer sur Rose
    await page.locator('[role="radio"][aria-label="Rose"]').click();

    // Vérifier que --color-accent a changé
    const accentColor = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--color-accent"),
    );
    expect(accentColor).toBe("#ff3c82");
  });

  test("la palette se ferme avec Escape", async ({ page }) => {
    const accentButton = page.locator('button[aria-label="Changer la couleur d\'accentuation"]');
    await accentButton.click();

    const palette = page.locator('[role="radiogroup"]');
    await expect(palette).toBeVisible();

    await page.keyboard.press("Escape");

    // La palette ne doit plus être visible
    await expect(palette).toBeHidden();
  });

  test("l'accent persiste après rechargement", async ({ page }) => {
    // Ouvrir et choisir Cyan
    await page.locator('button[aria-label="Changer la couleur d\'accentuation"]').click();
    await page.locator('[role="radio"][aria-label="Cyan"]').click();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const accentColor = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--color-accent"),
    );
    expect(accentColor).toBe("#00e5ff");
  });
});

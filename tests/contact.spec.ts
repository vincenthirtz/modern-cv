import { test, expect } from "@playwright/test";

/**
 * Tests du formulaire de contact.
 */

test.describe("Formulaire de contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
  });

  test("affiche les champs nom, email et message", async ({ page }) => {
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();
  });

  test("affiche les labels en français", async ({ page }) => {
    await expect(page.locator('label[for="name"]')).toContainText("Nom");
    await expect(page.locator('label[for="email"]')).toContainText("Email");
    await expect(page.locator('label[for="message"]')).toContainText("Message");
  });

  test("soumettre un formulaire vide affiche les erreurs de validation", async ({ page }) => {
    // Cliquer sur Envoyer sans remplir
    await page.locator('button[type="submit"]').click();

    // Les 3 messages d'erreur doivent apparaître
    await expect(page.locator("#name-error")).toBeVisible();
    await expect(page.locator("#name-error")).toContainText("Merci d'indiquer votre nom");

    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#email-error")).toContainText("Merci d'indiquer votre email");

    await expect(page.locator("#message-error")).toBeVisible();
    await expect(page.locator("#message-error")).toContainText("Le message ne peut pas être vide");
  });

  test("un email invalide affiche une erreur spécifique", async ({ page }) => {
    await page.fill("#name", "Test User");
    await page.fill("#email", "pas-un-email");
    await page.fill("#message", "Bonjour !");

    await page.locator('button[type="submit"]').click();

    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#email-error")).toContainText("Format d'email invalide");

    // Pas d'erreur sur les autres champs
    await expect(page.locator("#name-error")).not.toBeVisible();
    await expect(page.locator("#message-error")).not.toBeVisible();
  });

  test("un formulaire valide affiche le message de succès", async ({ page }) => {
    await page.fill("#name", "Vincent Test");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "Ceci est un test.");

    await page.locator('button[type="submit"]').click();

    // Le bouton doit afficher "Message envoyé ✓"
    await expect(page.locator('button[type="submit"]')).toContainText("Message envoyé");

    // Pas d'erreurs visibles
    await expect(page.locator("#name-error")).not.toBeVisible();
    await expect(page.locator("#email-error")).not.toBeVisible();
    await expect(page.locator("#message-error")).not.toBeVisible();
  });

  test("le focus est placé sur le premier champ en erreur", async ({ page }) => {
    // Remplir seulement le nom → l'email est le premier champ en erreur
    await page.fill("#name", "Test");

    await page.locator('button[type="submit"]').click();

    // Le focus doit être sur le champ email
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe("email");
  });

  test("les champs ont l'attribut aria-invalid en cas d'erreur", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true");
  });

  test("les liens sociaux sont présents", async ({ page }) => {
    await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
    await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email" })).toBeVisible();
  });
});

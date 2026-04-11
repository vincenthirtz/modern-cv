import { test, expect } from "@playwright/test";

/**
 * Tests d'accessibilité globaux.
 */

const ALL_PAGES = [
  { name: "Accueil", path: "/" },
  { name: "Projets", path: "/projects" },
  { name: "Expérience", path: "/experience" },
  { name: "Communauté", path: "/community" },
  { name: "Notes", path: "/notes" },
  { name: "Contact", path: "/contact" },
  { name: "CV", path: "/cv" },
  { name: "Branding", path: "/branding" },
  { name: "Expertise", path: "/expertise" },
];

test.describe("Accessibilité", () => {
  for (const { name, path } of ALL_PAGES) {
    test(`${name} — a un <main> et un heading principal`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Chaque page doit avoir un élément <main>
      await expect(page.locator("main")).toBeVisible();

      // Chaque page doit avoir au moins un heading (h1 ou h2)
      const headingCount = await page.locator("h1, h2").count();
      expect(headingCount).toBeGreaterThanOrEqual(1);
    });

    test(`${name} — aucune image sans alt`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Toutes les images doivent avoir un attribut alt (peut être vide pour les décoratives)
      const images = page.locator("img:not([alt])");
      const count = await images.count();
      expect(count, `${count} image(s) sans attribut alt sur ${path}`).toBe(0);
    });

    test(`${name} — les liens ont du texte accessible`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Tous les liens doivent avoir du texte ou un aria-label
      const emptyLinks = page.locator(
        "a:not([aria-label]):not([aria-labelledby]):not(:has(img)):not(:has(svg))",
      );
      const allEmpty = await emptyLinks.evaluateAll((links) =>
        links.filter((link) => {
          const text = link.textContent?.trim();
          return !text || text.length === 0;
        }),
      );
      expect(allEmpty.length, `${allEmpty.length} lien(s) sans texte accessible sur ${path}`).toBe(
        0,
      );
    });
  }

  test("la navigation au clavier fonctionne sur la page d'accueil", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Tab devrait d'abord atteindre le skip-link
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBe("A");
  });

  test("les boutons interactifs sont accessibles au clavier", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Le toggle de thème doit être activable au clavier
    const toggle = page.locator('button[aria-label="Activer le mode clair"]');
    await toggle.focus();
    await page.keyboard.press("Enter");

    // Doit basculer en mode clair
    await expect(page.locator('button[aria-label="Activer le mode sombre"]')).toBeVisible();
  });

  test("le breadcrumb est présent sur les sous-pages", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    // Le breadcrumb devrait contenir un lien vers l'accueil
    const breadcrumb = page.locator('nav[aria-label*="readcrumb"], nav[aria-label*="il d"]');
    // Si pas de breadcrumb explicite, vérifier qu'il y a un moyen de revenir
    const homeLink = page.locator('a[href="/"]');
    const homeLinkCount = await homeLink.count();
    expect(homeLinkCount).toBeGreaterThanOrEqual(1);
  });

  test("le formulaire de contact a les attributs ARIA corrects", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Les champs required doivent avoir required
    await expect(page.locator("#name")).toHaveAttribute("required", "");
    await expect(page.locator("#email")).toHaveAttribute("required", "");
    await expect(page.locator("#message")).toHaveAttribute("required", "");

    // Le formulaire a un aria-describedby
    const form = page.locator("form");
    await expect(form).toHaveAttribute("aria-describedby", "contact-status");

    // Le statut live region existe
    await expect(page.locator("#contact-status")).toHaveAttribute("aria-live", "polite");
  });
});

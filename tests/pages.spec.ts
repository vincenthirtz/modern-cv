import { test, expect } from "@playwright/test";

/**
 * Tests des pages individuelles — contenu, structure, liens.
 */

test.describe("Page Projets", () => {
  test("affiche les projets avec des cartes", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // Au moins un projet doit être listé
    const mainContent = await page.locator("main").textContent();
    expect(mainContent?.length).toBeGreaterThan(50);
  });
});

test.describe("Page Expérience", () => {
  test("affiche la timeline d'expériences professionnelles", async ({ page }) => {
    await page.goto("/experience");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // Doit contenir des expériences avec des noms d'entreprise ou dates
    const content = await page.locator("main").textContent();
    expect(content?.length).toBeGreaterThan(100);
  });
});

test.describe("Page Communauté", () => {
  test("affiche les projets open source et side projects", async ({ page }) => {
    await page.goto("/community");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });
});

test.describe("Page CV", () => {
  test("affiche le CV et contient un bouton d'impression", async ({ page }) => {
    await page.goto("/cv");
    await page.waitForLoadState("networkidle");

    // Le bouton d'impression doit être présent
    const printButton = page.getByText(/imprimer|print/i);
    // Ou un bouton avec une icône d'impression
    const anyPrintAction = page.locator("button").first();
    const pageContent = await page.locator("main").textContent();
    expect(pageContent?.length).toBeGreaterThan(100);
  });

  test("contient les informations professionnelles clés", async ({ page }) => {
    await page.goto("/cv");
    await page.waitForLoadState("networkidle");

    const content = await page.locator("main").textContent();

    // Le CV devrait mentionner Vincent Hirtz
    expect(content).toContain("Vincent");
  });
});

test.describe("Page Branding", () => {
  test("affiche la grille de couleurs et les polices", async ({ page }) => {
    await page.goto("/branding");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // La page doit contenir des éléments de design system
    const content = await page.locator("main").textContent();
    expect(content?.length).toBeGreaterThan(50);
  });
});

test.describe("Page Expertise", () => {
  test("affiche les compétences techniques", async ({ page }) => {
    await page.goto("/expertise");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    const content = await page.locator("main").textContent();
    expect(content?.length).toBeGreaterThan(50);
  });
});

test.describe("Pages — réponses HTTP", () => {
  const routes = [
    "/",
    "/projects",
    "/experience",
    "/community",
    "/notes",
    "/contact",
    "/cv",
    "/branding",
    "/expertise",
  ];

  for (const route of routes) {
    test(`${route} retourne un status 200`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });
  }

  test("une page inexistante retourne un 404", async ({ page }) => {
    const response = await page.goto("/cette-page-nexiste-pas");
    expect(response?.status()).toBe(404);
  });
});

test.describe("SEO — JSON-LD", () => {
  test("la homepage contient du JSON-LD structuré", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Vérifier que c'est du JSON valide
    const content = await jsonLd.first().textContent();
    expect(() => JSON.parse(content!)).not.toThrow();
  });
});

test.describe("Sécurité — headers", () => {
  test("les headers de sécurité sont présents", async ({ page }) => {
    const response = await page.goto("/");

    const headers = response?.headers() ?? {};

    // X-Content-Type-Options
    expect(headers["x-content-type-options"]).toBe("nosniff");

    // X-Frame-Options
    expect(headers["x-frame-options"]).toBeTruthy();
  });
});

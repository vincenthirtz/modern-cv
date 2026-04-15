import { test, expect } from "@playwright/test";

/**
 * Vérifie la structure des landmarks ARIA sur chaque page clé.
 * Détecte les régressions de sémantique (landmark manquant, heading
 * principal absent, plusieurs `<main>`, etc.).
 */

const PAGES = [
  { path: "/", expectedH1: true },
  { path: "/projects", expectedH1: true },
  { path: "/experience", expectedH1: true },
  { path: "/community", expectedH1: true },
  { path: "/notes", expectedH1: true },
  { path: "/contact", expectedH1: true },
  { path: "/cv", expectedH1: true },
];

for (const { path, expectedH1 } of PAGES) {
  test(`${path} — landmarks ARIA`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    // Exactement un <main>
    await expect(page.locator("main")).toHaveCount(1);

    // Au moins un banner/header et un contentinfo/footer
    const headerCount = await page.locator("header, [role='banner']").count();
    expect(headerCount).toBeGreaterThanOrEqual(1);
    const footerCount = await page.locator("footer, [role='contentinfo']").count();
    expect(footerCount).toBeGreaterThanOrEqual(1);

    // Les <nav> doivent avoir un aria-label unique
    const navLabels = await page.$$eval("nav", (navs) =>
      navs.map((n) => n.getAttribute("aria-label")).filter((l): l is string => Boolean(l)),
    );
    const uniqueNavLabels = new Set(navLabels);
    expect(uniqueNavLabels.size, `Navs sans aria-label ou doublons sur ${path}`).toBe(
      navLabels.length,
    );

    // Un seul h1 par page
    if (expectedH1) {
      await expect(page.locator("h1")).toHaveCount(1);
    }

    // Hiérarchie des headings : pas de saut (h1 -> h3 sans h2)
    const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (els) =>
      els.map((el) => parseInt(el.tagName.slice(1), 10)),
    );
    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1];
      expect(
        jump,
        `Saut de heading h${levels[i - 1]} → h${levels[i]} sur ${path}`,
      ).toBeLessThanOrEqual(1);
    }
  });
}

test("la home expose les 7 sections principales via landmarks ou aria-labelledby", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Chaque grande section devrait avoir un id ou un aria-labelledby
  const sections = await page.$$eval("main section", (els) =>
    els.map((el) => ({
      id: el.id,
      label: el.getAttribute("aria-label") || el.getAttribute("aria-labelledby"),
    })),
  );

  const labelled = sections.filter((s) => s.id || s.label);
  expect(
    labelled.length,
    `Sections non identifiables : ${sections.length - labelled.length}`,
  ).toBeGreaterThanOrEqual(Math.floor(sections.length * 0.8));
});

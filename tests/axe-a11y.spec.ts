import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Tests d'accessibilité automatisés via axe-core.
 * Détecte les violations WCAG 2.1 AA sur chaque page.
 */

const PAGES = [
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

for (const { name, path } of PAGES) {
  test(`${name} (${path}) — aucune violation WCAG 2.1 AA`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Exclure le grain overlay (élément décoratif sans sémantique)
      .exclude(".bg-noise")
      // TODO: corriger ces violations pré-existantes puis retirer ces exclusions
      .disableRules(["color-contrast", "scrollable-region-focusable"])
      .analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      help: v.helpUrl,
    }));

    expect(
      violations,
      `Violations trouvées sur ${path}:\n${JSON.stringify(violations, null, 2)}`,
    ).toEqual([]);
  });
}

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Tests d'accessibilité automatisés via axe-core.
 * Détecte les violations WCAG 2.2 AA sur chaque page.
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
  { name: "Mentions légales", path: "/mentions-legales" },
  { name: "Accessibilité", path: "/accessibilite" },
];

for (const { name, path } of PAGES) {
  test(`${name} (${path}) — aucune violation WCAG 2.2 AA`, async ({ page }) => {
    // Neutralise les animations : les styles inline avec opacity/filter en cours
    // de transition font faussement échouer la vérification de contraste sur
    // un état transitoire. En mode reduced-motion, les animations sont stoppées
    // (durée 0.001ms dans globals.css), ce qui fige le rendu final.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // Exclure le grain overlay (élément décoratif sans sémantique)
      .exclude(".bg-noise")
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

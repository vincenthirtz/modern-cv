import { test, expect, type Page } from "@playwright/test";
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

// Le mode clair a ses propres couleurs (accent, fonds) : il doit être audité
// au même titre que le mode sombre par défaut.
const THEMES = ["dark", "light"] as const;

for (const theme of THEMES) {
  for (const { name, path } of PAGES) {
    test(`${name} (${path}) [${theme}] — aucune violation WCAG 2.2 AA`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await expectNoViolations(page, path, [
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
      ]);
    });
  }
}

// Chaque accent a sa palette (texte sur accent, variante light…) : contraste
// vérifié sur les pages qui concentrent le plus d'éléments en couleur d'accent.
const ACCENTS = ["Lime", "Cyan", "Rose", "Orange", "Violet"] as const;
const ACCENT_PAGES = ["/", "/cv", "/branding"];

for (const accent of ACCENTS) {
  for (const theme of THEMES) {
    for (const path of ACCENT_PAGES) {
      test(`${path} [${theme} · ${accent}] — contraste AA`, async ({ page }) => {
        await page.addInitScript(
          ([t, a]) => {
            localStorage.setItem("theme", t);
            localStorage.setItem("accent", a);
          },
          [theme, accent],
        );
        await expectNoViolations(page, path, ["wcag2aa"], ["color-contrast"]);
      });
    }
  }
}

async function expectNoViolations(page: Page, path: string, tags: string[], rules?: string[]) {
  // Neutralise les animations : les styles inline avec opacity/filter en cours
  // de transition font faussement échouer la vérification de contraste sur
  // un état transitoire. En mode reduced-motion, les animations sont stoppées
  // (durée 0.001ms dans globals.css), ce qui fige le rendu final.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.waitForLoadState("networkidle");

  let builder = new AxeBuilder({ page })
    .withTags(tags)
    // Exclure le grain overlay (élément décoratif sans sémantique)
    .exclude(".bg-noise");
  if (rules) builder = builder.withRules(rules);
  const results = await builder.analyze();

  const violations = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    help: v.helpUrl,
  }));

  expect(
    violations,
    `Violations trouvées sur ${path}:\n${JSON.stringify(violations, null, 2)}`,
  ).toEqual([]);
}

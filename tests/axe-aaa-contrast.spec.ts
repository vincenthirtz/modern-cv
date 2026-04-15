import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Audit contraste AAA (WCAG 2.2 §1.4.6 — 7:1 pour texte courant, 4.5:1 gros texte).
 *
 * Ce test est informatif : il liste les nodes qui échouent au niveau AAA
 * mais ne bloque pas la CI tant que le niveau AA passe (géré par axe-a11y.spec.ts).
 * Il signale les zones où un renforcement de contraste serait bénéfique.
 */

const PAGES = [
  { name: "Accueil", path: "/" },
  { name: "Contact", path: "/contact" },
  { name: "Notes", path: "/notes" },
  { name: "CV", path: "/cv" },
];

for (const { name, path } of PAGES) {
  test(`${name} (${path}) — audit contraste AAA (non bloquant)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast-enhanced"])
      .exclude(".bg-noise")
      .analyze();

    const issues = results.violations.flatMap((v) =>
      v.nodes.map((n) => ({
        selector: n.target.join(" "),
        summary: n.failureSummary?.split("\n")[1]?.trim() ?? "",
      })),
    );

    // Logge les échecs AAA pour information mais laisse le test passer.
    if (issues.length > 0) {
      console.warn(
        `\n⚠️  ${issues.length} zone(s) sous AAA (7:1) sur ${path} :\n` +
          issues
            .slice(0, 10)
            .map((i) => `  - ${i.selector} : ${i.summary}`)
            .join("\n") +
          (issues.length > 10 ? `\n  … et ${issues.length - 10} autres.` : ""),
      );
    }

    // Aucun crash axe : le test passe toujours. C'est un audit, pas un gate.
    expect(results).toBeTruthy();
  });
}

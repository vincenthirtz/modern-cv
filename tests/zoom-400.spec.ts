import { test, expect } from "@playwright/test";

/**
 * WCAG 2.2 AA §1.4.10 (Reflow) : le contenu doit rester lisible
 * à un zoom 400% sans scroll horizontal (sauf éléments à 2D obligatoire).
 *
 * Viewport 320×256 simule un zoom 400% sur un écran de référence 1280×1024.
 */

const PAGES = ["/", "/projects", "/experience", "/community", "/notes", "/contact", "/cv"];

test.describe("Zoom 400% (reflow)", () => {
  test.use({ viewport: { width: 320, height: 256 } });

  for (const path of PAGES) {
    test(`${path} — pas de scroll horizontal`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // documentElement.scrollWidth ≤ clientWidth + 1px de tolérance (rounding).
      const overflow = await page.evaluate(() => {
        const { scrollWidth, clientWidth } = document.documentElement;
        return scrollWidth - clientWidth;
      });
      expect(overflow, `scroll horizontal de ${overflow}px sur ${path}`).toBeLessThanOrEqual(1);
    });

    test(`${path} — le contenu principal est visible`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("main")).toBeVisible();
      const h1OrH2 = page.locator("h1, h2").first();
      await expect(h1OrH2).toBeVisible();
    });
  }
});

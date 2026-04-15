import { test, expect } from "@playwright/test";

/**
 * Vérifie que les effets visuels lourds sont désactivés quand l'utilisateur
 * demande `prefers-reduced-motion: reduce` au niveau OS.
 *
 * - CursorFollower, BackgroundShift, GrainOverlay : retirés du DOM
 * - Animations CSS (Marquee, keyframes) : figées (0.001ms)
 * - Classe `.reduced-effects` : ajoutée sur <html> par EffectsProvider
 */

test.describe("prefers-reduced-motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("EffectsProvider ajoute la classe .reduced-effects sur <html>", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html.reduced-effects")).toHaveCount(1);
  });

  test("CursorFollower absent du DOM", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".cursor-glow")).toHaveCount(0);
  });

  test("GrainOverlay absent du DOM", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".bg-noise")).toHaveCount(0);
  });

  test("BackgroundShift absent du DOM", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Le composant rend un div fixed avec background-color interpolée ; absent en reduced.
    const fixedBg = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll("div.fixed.inset-0"));
      return nodes.filter((el) => {
        const style = window.getComputedStyle(el);
        return style.willChange.includes("background-color");
      }).length;
    });
    expect(fixedBg).toBe(0);
  });

  test("animations CSS figées (Marquee sur /expertise)", async ({ page }) => {
    await page.goto("/expertise");
    await page.waitForLoadState("networkidle");
    const marquee = page.locator(".animate-marquee").first();
    await expect(marquee).toHaveCount(1);
    const duration = await marquee.evaluate((el) => window.getComputedStyle(el).animationDuration);
    // globals.css force 0.001ms pour toutes les animations en reduced-motion.
    expect(duration).toBe("0.001ms");
  });
});

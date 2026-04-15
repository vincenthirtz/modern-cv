import { test, expect } from "@playwright/test";

/**
 * Tests de navigation au clavier end-to-end.
 * Vérifie qu'aucun élément ne piège ou perd le focus, et que les
 * raccourcis clavier essentiels (Tab, Shift+Tab, Enter, Escape) sont respectés.
 */

test.describe("Navigation clavier", () => {
  test("Tab parcourt les éléments focusables sans piège", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const visitedIds = new Set<string>();
    const maxTabs = 40;
    let previousActive = "";

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");
      const current = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return "__body__";
        const tag = el.tagName.toLowerCase();
        const id = el.id || el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 30);
        return `${tag}#${id}`;
      });

      // Focus trap si on reste bloqué sur le même élément 3x
      expect(current).not.toBe(previousActive);
      previousActive = current;
      visitedIds.add(current);
    }

    // On a bien visité plusieurs éléments distincts
    expect(visitedIds.size).toBeGreaterThan(5);
  });

  test("Shift+Tab revient en arrière", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement?.tagName);
    await page.keyboard.press("Tab");
    const second = await page.evaluate(() => document.activeElement?.tagName);
    await page.keyboard.press("Shift+Tab");
    const backToFirst = await page.evaluate(() => document.activeElement?.tagName);

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(backToFirst).toBe(first);
  });

  test("skip-link donne le focus au <main>", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Premier Tab = skip-link
    await page.keyboard.press("Tab");
    const skipLink = await page.evaluate(() => document.activeElement?.getAttribute("href"));
    expect(skipLink).toBe("#main");

    // Activer le skip-link
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("aucun élément interactif n'est accessible uniquement à la souris", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Tous les éléments cliquables (boutons, liens) doivent être focusables.
    const unfocusable = await page.evaluate(() => {
      const interactive = document.querySelectorAll(
        'button, a[href], input, select, textarea, [role="button"]',
      );
      const bad: string[] = [];
      interactive.forEach((el) => {
        const tabindex = el.getAttribute("tabindex");
        if (tabindex === "-1") {
          // Acceptable uniquement si l'élément est aussi aria-hidden
          if (el.getAttribute("aria-hidden") !== "true") {
            bad.push(`${el.tagName}#${el.id || (el.textContent?.trim().slice(0, 30) ?? "?")}`);
          }
        }
      });
      return bad;
    });

    expect(unfocusable, `Éléments interactifs non focusables : ${unfocusable.join(", ")}`).toEqual(
      [],
    );
  });
});

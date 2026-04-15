import { test, expect } from "@playwright/test";

/**
 * E2E du flux de like sur un article :
 * - Affiche le compteur initial via GET /api/likes
 * - Incrémente via POST /api/likes au clic
 * - L'état "liked" est persisté en localStorage (un like par slug)
 * - Le rate limit côté serveur répond 429 au-delà de 10 POST/min
 */

test.describe("Flux de like", () => {
  test("le bouton incrémente le compteur et persiste l'état", async ({ page }) => {
    await page.goto("/notes");
    await page.waitForLoadState("networkidle");

    const firstLink = page.locator('ul li a[href^="/notes/"]').first();
    const href = await firstLink.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await page.waitForLoadState("networkidle");

    const likeBtn = page.locator(".like-btn").first();
    await expect(likeBtn).toBeVisible();

    const initialText = (await likeBtn.textContent()) ?? "";
    const initial = parseInt(initialText.replace(/\D/g, ""), 10) || 0;

    await likeBtn.click();
    await expect(likeBtn).toHaveClass(/like-btn--liked/);

    await expect
      .poll(async () => {
        const t = (await likeBtn.textContent()) ?? "";
        return parseInt(t.replace(/\D/g, ""), 10) || 0;
      })
      .toBeGreaterThanOrEqual(initial + 1);

    // Recharge → le bouton reste "liked" (localStorage)
    await page.reload();
    await expect(page.locator(".like-btn").first()).toHaveClass(/like-btn--liked/);
  });

  test("l'API likes répond 429 au-delà du seuil", async ({ request }) => {
    const slug = "rate-limit-test-" + Date.now();
    const responses: number[] = [];

    for (let i = 0; i < 12; i++) {
      const res = await request.post("/api/likes", { data: { slug } });
      responses.push(res.status());
    }

    // 10 succès puis au moins un 429
    const ok = responses.filter((s) => s === 200).length;
    const limited = responses.filter((s) => s === 429).length;
    expect(ok).toBeLessThanOrEqual(10);
    expect(limited).toBeGreaterThanOrEqual(1);
  });

  test("GET /api/likes refuse une requête sans slug", async ({ request }) => {
    const res = await request.get("/api/likes");
    expect(res.status()).toBe(400);
  });
});

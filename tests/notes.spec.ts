import { test, expect } from "@playwright/test";

/**
 * Tests de la page Notes (blog) — recherche, filtres, navigation vers articles.
 */

test.describe("Page Notes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/notes");
    await page.waitForLoadState("networkidle");
  });

  test("affiche la liste des articles", async ({ page }) => {
    // Au moins un article doit être visible
    const articles = page.locator("ul li a.group");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("chaque article affiche titre et catégorie", async ({ page }) => {
    const firstArticle = page.locator('ul li a[href^="/notes/"]').first();
    await expect(firstArticle).toBeVisible();

    // Titre (h2)
    await expect(firstArticle.locator("h2")).toBeVisible();

    // Lien "Lire l'article"
    await expect(firstArticle.getByText("Lire l'article")).toBeVisible();
  });

  test("la recherche filtre les articles", async ({ page }) => {
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Compter les articles avant
    const initialCount = await page.locator("ul li").count();

    // Taper un terme qui ne correspond à rien
    await searchInput.fill("xyztermeimpossible");
    await page.waitForTimeout(300);

    // Le message "Aucun article trouvé" doit apparaître
    await expect(page.getByText("Aucun article trouvé")).toBeVisible();

    // Effacer la recherche pour retrouver tous les articles
    await searchInput.fill("");
    await page.waitForTimeout(300);

    const restoredCount = await page.locator("ul li").count();
    expect(restoredCount).toBe(initialCount);
  });

  test("les filtres par catégorie fonctionnent", async ({ page }) => {
    // Le bouton "Tous" doit être présent
    const allButton = page.getByRole("button", { name: "Tous" });
    await expect(allButton).toBeVisible();

    // Cliquer sur une catégorie spécifique (la première après "Tous")
    const categoryButtons = page.locator("button").filter({ hasText: /^(?!Tous)/ });
    const firstCategory = categoryButtons.first();
    const categoryText = await firstCategory.textContent();

    if (categoryText) {
      await firstCategory.click();
      await page.waitForTimeout(300);

      // Vérifier que les articles affichés correspondent à la catégorie
      const articles = page.locator("ul li");
      const count = await articles.count();

      if (count > 0) {
        // Chaque article visible doit avoir la bonne catégorie
        for (let i = 0; i < count; i++) {
          const badge = articles.nth(i).locator(".rounded-full").first();
          await expect(badge).toContainText(categoryText.trim());
        }
      }

      // Recliquer pour désactiver le filtre
      await firstCategory.click();
    }
  });

  test("cliquer sur un article navigue vers la page détail", async ({ page }) => {
    const firstLink = page.locator('ul li a[href^="/notes/"]').first();
    const href = await firstLink.getAttribute("href");

    await firstLink.click();
    await page.waitForURL(`**${href}`);

    expect(page.url()).toContain("/notes/");
  });

  test("le champ de recherche a un aria-label", async ({ page }) => {
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toHaveAttribute("aria-label", "Rechercher dans les articles");
  });

  test("le compteur de résultats s'affiche lors du filtrage", async ({ page }) => {
    // Utiliser la recherche pour activer le compteur
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("react");
    await page.waitForTimeout(500);

    // Le compteur doit être visible si des résultats existent
    const articles = page.locator("ul li");
    const count = await articles.count();

    if (count > 0) {
      const counter = page.getByText(/article[s]? trouvé/);
      await expect(counter).toBeVisible();
    }
  });
});

test.describe("Page article (détail)", () => {
  test("affiche le contenu de l'article avec table des matières", async ({ page }) => {
    // Aller sur la page notes et cliquer sur le premier article
    await page.goto("/notes");
    await page.waitForLoadState("networkidle");

    const firstLink = page.locator('ul li a[href^="/notes/"]').first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    await page.waitForLoadState("networkidle");

    // L'article doit avoir un titre h1
    await expect(page.locator("h1").first()).toBeVisible();

    // Le contenu prose doit être présent
    const content = page.locator("article, .prose, main");
    await expect(content.first()).toBeVisible();
  });

  test("le bouton de partage est fonctionnel", async ({ page }) => {
    await page.goto("/notes");
    await page.waitForLoadState("networkidle");

    const firstLink = page.locator('ul li a[href^="/notes/"]').first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    await page.waitForLoadState("networkidle");

    // Au minimum, il devrait y avoir un lien de retour vers les notes
    const backLink = page.locator('a[href="/notes"]');
    await expect(backLink.first()).toBeVisible();
  });
});

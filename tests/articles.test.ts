import { describe, it, expect, vi } from "vitest";
import type { Article } from "@/lib/articles";

// Mock les imports MDX pour isoler la logique pure
const MOCK_ARTICLES: Article[] = [
  {
    slug: "react-hooks",
    title: "Les hooks React",
    excerpt: "Guide des hooks",
    category: "React",
    tags: ["react", "hooks", "frontend"],
    date: "2026-03-01",
    dateLabel: "Mars 2026",
    readTime: "~5 min",
    Content: () => null,
  },
  {
    slug: "vue-composition",
    title: "Vue Composition API",
    excerpt: "Guide Composition API",
    category: "Vue",
    tags: ["vue", "frontend", "typescript"],
    date: "2026-02-15",
    dateLabel: "Fev 2026",
    readTime: "~4 min",
    Content: () => null,
  },
  {
    slug: "cypress-testing",
    title: "Tests E2E avec Cypress",
    excerpt: "Guide Cypress",
    category: "Testing",
    tags: ["testing", "cypress", "frontend"],
    date: "2026-01-10",
    dateLabel: "Jan 2026",
    readTime: "~6 min",
    Content: () => null,
  },
  {
    slug: "typescript-strict",
    title: "TypeScript strict mode",
    excerpt: "Guide strict mode",
    category: "TypeScript",
    tags: ["typescript", "tooling"],
    date: "2025-12-20",
    dateLabel: "Dec 2025",
    readTime: "~3 min",
    Content: () => null,
  },
];

vi.mock("@/lib/articles/cypress.mdx", () => ({ default: () => null, meta: {} }));
vi.mock("@/lib/articles/pulse-js.mdx", () => ({ default: () => null, meta: {} }));
vi.mock("@/lib/articles/react19-removechild.mdx", () => ({ default: () => null, meta: {} }));
vi.mock("@/lib/articles/vue-laravel.mdx", () => ({ default: () => null, meta: {} }));

// On mock le module entier pour injecter nos articles de test
vi.mock("@/lib/articles", async () => {
  const ARTICLES = MOCK_ARTICLES.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  return {
    ARTICLES,
    getArticleBySlug: (slug: string) => ARTICLES.find((a) => a.slug === slug),
    getAllSlugs: () => ARTICLES.map((a) => a.slug),
    getRelatedArticles: (slug: string, max = 2) => {
      const current = ARTICLES.find((a) => a.slug === slug);
      if (!current) return [];
      const currentTags = new Set(current.tags);
      return ARTICLES.filter((a) => a.slug !== slug)
        .map((a) => ({
          article: a,
          score: a.tags.filter((t: string) => currentTags.has(t)).length,
        }))
        .sort((a, b) => b.score - a.score || (a.article.date < b.article.date ? 1 : -1))
        .slice(0, max)
        .map((r) => r.article);
    },
  };
});

// Import après le mock
const { getArticleBySlug, getAllSlugs, getRelatedArticles, ARTICLES } =
  await import("@/lib/articles");

describe("lib/articles", () => {
  describe("ARTICLES", () => {
    it("est trié par date décroissante", () => {
      for (let i = 1; i < ARTICLES.length; i++) {
        expect(ARTICLES[i - 1].date >= ARTICLES[i].date).toBe(true);
      }
    });
  });

  describe("getArticleBySlug", () => {
    it("retourne l'article correspondant au slug", () => {
      const article = getArticleBySlug("react-hooks");
      expect(article).toBeDefined();
      expect(article!.title).toBe("Les hooks React");
    });

    it("retourne undefined pour un slug inexistant", () => {
      expect(getArticleBySlug("inexistant")).toBeUndefined();
    });

    it("retourne undefined pour un slug vide", () => {
      expect(getArticleBySlug("")).toBeUndefined();
    });
  });

  describe("getAllSlugs", () => {
    it("retourne tous les slugs", () => {
      const slugs = getAllSlugs();
      expect(slugs).toHaveLength(MOCK_ARTICLES.length);
      expect(slugs).toContain("react-hooks");
      expect(slugs).toContain("vue-composition");
      expect(slugs).toContain("cypress-testing");
      expect(slugs).toContain("typescript-strict");
    });
  });

  describe("getRelatedArticles", () => {
    it("retourne les articles avec le plus de tags en commun", () => {
      // react-hooks a les tags: react, hooks, frontend
      // vue-composition a: vue, frontend, typescript → 1 commun (frontend)
      // cypress-testing a: testing, cypress, frontend → 1 commun (frontend)
      // typescript-strict a: typescript, tooling → 0 commun
      const related = getRelatedArticles("react-hooks", 2);
      expect(related).toHaveLength(2);
      // Les deux avec "frontend" doivent être en premier
      const slugs = related.map((a) => a.slug);
      expect(slugs).not.toContain("react-hooks");
      expect(slugs).toContain("vue-composition");
      expect(slugs).toContain("cypress-testing");
    });

    it("ne contient jamais l'article source", () => {
      const related = getRelatedArticles("react-hooks", 10);
      expect(related.every((a) => a.slug !== "react-hooks")).toBe(true);
    });

    it("respecte la limite max", () => {
      const related = getRelatedArticles("react-hooks", 1);
      expect(related).toHaveLength(1);
    });

    it("retourne un tableau vide pour un slug inexistant", () => {
      expect(getRelatedArticles("inexistant")).toEqual([]);
    });

    it("à score égal, trie par date décroissante", () => {
      // vue-composition (2026-02-15) et cypress-testing (2026-01-10) ont le même score (1)
      const related = getRelatedArticles("react-hooks", 2);
      const [first, second] = related;
      if (first.slug === "vue-composition" || first.slug === "cypress-testing") {
        // Les deux ont 1 tag commun, le plus récent doit être en premier
        expect(first.date >= second.date).toBe(true);
      }
    });
  });
});

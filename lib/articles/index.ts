import type { ComponentType } from "react";
import PulseJsArticle, { meta as pulseJsMeta } from "./pulse-js.mdx";
import VueLaravelArticle, { meta as vueLaravelMeta } from "./vue-laravel.mdx";
import CypressArticle, { meta as cypressMeta } from "./cypress.mdx";

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Date ISO pour le tri et schema.org */
  date: string;
  /** Date affichée au format français */
  dateLabel: string;
  readTime: string;
}

export interface Article extends ArticleMeta {
  Content: ComponentType;
}

/**
 * Manifest d'articles. Le contenu et la métadonnée vivent désormais dans
 * un même fichier `.mdx` (frontmatter via `export const meta`). Ici on se
 * contente d'agréger et de trier par date décroissante.
 */
export const ARTICLES: Article[] = [
  { ...pulseJsMeta, Content: PulseJsArticle },
  { ...vueLaravelMeta, Content: VueLaravelArticle },
  { ...cypressMeta, Content: CypressArticle },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

import type { ComponentType } from "react";
import CypressArticle, { meta as cypressMeta } from "./cypress.mdx";
import PulseJsArticle, { meta as pulseJsMeta } from "./pulse-js.mdx";
import React19RemovechildArticle, {
  meta as react19RemovechildMeta,
} from "./react19-removechild.mdx";
import ServiceWorkerNextjsNavigationArticle, {
  meta as serviceWorkerNextjsNavigationMeta,
} from "./service-worker-nextjs-navigation.mdx";
import VueLaravelArticle, { meta as vueLaravelMeta } from "./vue-laravel.mdx";

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Tags pour le filtrage et les recommandations d'articles liés */
  tags: string[];
  /** Date ISO pour le tri et schema.org */
  date: string;
  /** Date affichée au format français */
  dateLabel: string;
  /** Date ISO de dernière révision (optionnel, pour schema.org/dateModified) */
  updatedAt?: string;
  /** Date de révision affichée au format français */
  updatedAtLabel?: string;
  /** URL de l'image de couverture (ex: images.unsplash.com/photo-...) */
  cover?: string;
  /** Texte alternatif pour l'accessibilité */
  coverAlt?: string;
  /** Nom du photographe pour le crédit */
  coverCredit?: string;
  /** URL du profil du photographe (typiquement unsplash.com/@username) */
  coverCreditUrl?: string;
  readTime: string;
}

export interface Article extends ArticleMeta {
  Content: ComponentType;
}

/**
 * Manifest d'articles — généré automatiquement par scripts/generate-articles-index.mjs.
 * Ne pas modifier manuellement : ajouter un fichier .mdx dans lib/articles/ puis
 * relancer `node scripts/generate-articles-index.mjs` ou `npm run build`.
 */
export const ARTICLES: Article[] = [
  { ...cypressMeta, Content: CypressArticle },
  { ...pulseJsMeta, Content: PulseJsArticle },
  { ...react19RemovechildMeta, Content: React19RemovechildArticle },
  { ...serviceWorkerNextjsNavigationMeta, Content: ServiceWorkerNextjsNavigationArticle },
  { ...vueLaravelMeta, Content: VueLaravelArticle },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/**
 * Renvoie les articles les plus proches par tags communs.
 * Score = nombre de tags partagés. À score égal, l'article le plus récent gagne.
 */
export function getRelatedArticles(slug: string, max = 2): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  const currentTags = new Set(current.tags);

  return ARTICLES.filter((a) => a.slug !== slug)
    .map((a) => ({
      article: a,
      score: a.tags.filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.article.date < b.article.date ? 1 : -1))
    .slice(0, max)
    .map((r) => r.article);
}

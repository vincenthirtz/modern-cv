import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

/**
 * Génère /sitemap.xml automatiquement.
 * Inclut la home, l'index des notes, et chaque article publié.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vincenthirtz.fr";
  const now = new Date();

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${base}/notes/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/notes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/cv`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/branding`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...articleEntries,
  ];
}

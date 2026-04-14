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
      url: `${base}/expertise`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${base}/notes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/experience`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/community`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
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
    {
      url: `${base}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/accessibilite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articleEntries,
  ];
}

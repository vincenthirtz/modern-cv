import type { MetadataRoute } from "next";

/**
 * Génère /robots.txt automatiquement.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://vincenthirtz.fr/sitemap.xml",
    host: "https://vincenthirtz.fr",
  };
}

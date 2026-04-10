import { ARTICLES } from "@/lib/articles";

const SITE_URL = "https://vincenthirtz.fr";

/**
 * Route handler qui génère un flux RSS 2.0 pour les articles du blog.
 * Accessible via /feed.xml
 */
export function GET() {
  const items = ARTICLES.map(
    (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/notes/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/notes/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.category)}</category>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    </item>`,
  ).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vincent Hirtz — Notes</title>
    <link>${SITE_URL}/notes</link>
    <description>Réflexions et retours d'expérience sur le développement front-end, par Vincent Hirtz.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

/** Échappe les caractères spéciaux XML */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

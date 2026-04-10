import { ARTICLES } from "@/lib/articles";

const SITE_URL = "https://vincenthirtz.fr";

/**
 * Route handler qui génère un flux Atom 1.0 pour les articles du blog.
 * Accessible via /feed.atom — complément du RSS 2.0 existant (/feed.xml).
 *
 * Atom est préféré par la plupart des lecteurs modernes (Feedly, Inoreader,
 * NetNewsWire) pour sa spécification plus stricte et son support natif
 * de l'UTF-8 et du contenu HTML.
 */
export function GET() {
  const updated =
    ARTICLES.length > 0 ? new Date(ARTICLES[0].date).toISOString() : new Date().toISOString();

  const entries = ARTICLES.map(
    (article) => `
  <entry>
    <title>${escapeXml(article.title)}</title>
    <link href="${SITE_URL}/notes/${article.slug}" rel="alternate" type="text/html" />
    <id>${SITE_URL}/notes/${article.slug}</id>
    <published>${new Date(article.date).toISOString()}</published>
    <updated>${new Date(article.date).toISOString()}</updated>
    <summary>${escapeXml(article.excerpt)}</summary>
    <category term="${escapeXml(article.category)}" />
    <author>
      <name>Vincent Hirtz</name>
      <uri>${SITE_URL}</uri>
    </author>
  </entry>`,
  ).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
  <title>Vincent Hirtz — Notes</title>
  <subtitle>Réflexions et retours d'expérience sur le développement front-end.</subtitle>
  <link href="${SITE_URL}/notes" rel="alternate" type="text/html" />
  <link href="${SITE_URL}/feed.atom" rel="self" type="application/atom+xml" />
  <id>${SITE_URL}/notes</id>
  <updated>${updated}</updated>
  <author>
    <name>Vincent Hirtz</name>
    <uri>${SITE_URL}</uri>
  </author>
  <icon>${SITE_URL}/icon.svg</icon>${entries}
</feed>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

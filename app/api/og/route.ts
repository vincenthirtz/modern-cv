import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

/**
 * Route API pour extraire les métadonnées Open Graph d'une URL externe.
 * Utilisée par le composant LinkPreview pour éviter les problèmes CORS.
 *
 * GET /api/og?url=https://example.com
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  // Validation basique de l'URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // Bloquer les requêtes vers localhost / IP privées
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.startsWith("127.") ||
    parsed.hostname.startsWith("10.") ||
    parsed.hostname.startsWith("192.168.")
  ) {
    return NextResponse.json({ error: "private urls not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "fetch failed" }, { status: 502 });
    }

    const html = await response.text();

    const og: OGData = {
      title: extractMeta(html, "og:title") ?? extractTag(html, "title"),
      description: extractMeta(html, "og:description") ?? extractMeta(html, "description"),
      image: extractMeta(html, "og:image"),
      siteName: extractMeta(html, "og:site_name") ?? parsed.hostname,
    };

    return NextResponse.json(og, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "timeout or network error" }, { status: 502 });
  }
}

/** Extrait le contenu d'une balise <meta property="..." content="..."> ou <meta name="..." content="..."> */
function extractMeta(html: string, property: string): string | null {
  // property= ou name=
  const regex = new RegExp(
    `<meta[^>]*(?:property|name)=["']${escapeRegex(property)}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const match = regex.exec(html);
  if (match) return match[1];

  // Format inversé : content avant property
  const regexAlt = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${escapeRegex(property)}["']`,
    "i",
  );
  const matchAlt = regexAlt.exec(html);
  return matchAlt ? matchAlt[1] : null;
}

/** Extrait le contenu d'une balise <title>...</title> */
function extractTag(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = regex.exec(html);
  return match ? match[1].trim() : null;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

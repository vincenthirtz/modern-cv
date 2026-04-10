import { NextRequest, NextResponse } from "next/server";

/**
 * API de likes anonymes par article.
 *
 * Stockage en mémoire (reset au redémarrage). Pour un stockage persistant,
 * remplacer `likesStore` par Upstash Redis ou Vercel KV :
 *
 *   import { kv } from "@vercel/kv";
 *   const get = (slug: string) => kv.get<number>(`likes:${slug}`);
 *   const incr = (slug: string) => kv.incr(`likes:${slug}`);
 *
 * GET /api/likes?slug=mon-article   → { likes: 42 }
 * POST /api/likes { slug: "mon-article" } → { likes: 43 }
 */

const likesStore = new Map<string, number>();

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug parameter required" }, { status: 400 });
  }

  const likes = likesStore.get(slug) ?? 0;
  return NextResponse.json({ likes });
}

export async function POST(request: NextRequest) {
  let slug: string;
  try {
    const body = await request.json();
    slug = body.slug;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const current = likesStore.get(slug) ?? 0;
  likesStore.set(slug, current + 1);

  return NextResponse.json({ likes: current + 1 });
}

import { NextRequest, NextResponse } from "next/server";
import { getLikes, incrementLikes } from "@/lib/likes-store";

/**
 * API de likes anonymes par article.
 *
 * Stockage persistant via fichier JSON (voir lib/likes-store.ts).
 *
 * GET  /api/likes?slug=mon-article   → { likes: 42 }
 * POST /api/likes { slug: "mon-article" } → { likes: 43 }
 */

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug parameter required" }, { status: 400 });
  }

  const likes = await getLikes(slug);
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

  const likes = await incrementLikes(slug);
  return NextResponse.json({ likes });
}

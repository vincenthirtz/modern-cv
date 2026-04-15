import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLikes, incrementLikes } from "@/lib/likes-store";
import { rateLimit } from "@/lib/rate-limit";

/**
 * API de likes anonymes par article.
 *
 * Stockage persistant via fichier JSON (voir lib/likes-store.ts).
 *
 * GET  /api/likes?slug=mon-article   → { likes: 42 }
 * POST /api/likes { slug: "mon-article" } → { likes: 43 }
 *
 * Rate limit : 10 POST / min / IP, 60 GET / min / IP.
 */

function rateLimited(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

export async function GET(request: NextRequest) {
  const rl = rateLimit(request, { limit: 60, windowMs: 60_000, key: "likes:get" });
  if (!rl.ok) return rateLimited(rl.retryAfter);

  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug parameter required" }, { status: 400 });
  }

  const likes = await getLikes(slug);
  return NextResponse.json({ likes });
}

export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 10, windowMs: 60_000, key: "likes:post" });
  if (!rl.ok) return rateLimited(rl.retryAfter);

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

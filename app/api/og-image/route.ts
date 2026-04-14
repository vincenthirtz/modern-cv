import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy pour images OpenGraph externes. Permet à next/image d'optimiser
 * (AVIF/WebP, resize) des images tierces en les servant depuis notre origine,
 * tout en appliquant un cache long côté edge.
 *
 * GET /api/og-image?url=https://example.com/og.png
 */

const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.startsWith("127.") ||
    parsed.hostname.startsWith("10.") ||
    parsed.hostname.startsWith("192.168.") ||
    parsed.hostname.startsWith("169.254.")
  ) {
    return NextResponse.json({ error: "private urls not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
        Accept: "image/*",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "fetch failed" }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "unsupported content-type" }, { status: 415 });
    }

    const contentLength = Number(upstream.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BYTES) {
      return NextResponse.json({ error: "image too large" }, { status: 413 });
    }

    const buffer = await upstream.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "image too large" }, { status: 413 });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "timeout or network error" }, { status: 502 });
  }
}

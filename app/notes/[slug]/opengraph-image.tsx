import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

export const runtime = "nodejs";
export const alt = "Article — Vincent Hirtz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Palette d'accents par catégorie (cohérente avec les thèmes du site). */
const CATEGORY_ACCENTS: Record<string, string> = {
  Debug: "#ff6b6b",
  Tests: "#7afcff",
  Architecture: "#c084fc",
  "Open Source": "#ffb347",
};
const DEFAULT_ACCENT = "#c8ff00";

/**
 * Lit le fichier cover depuis public/ et le convertit en data URL.
 * On reste en local (pas d'appel HTTP) pour éviter tout crash de satori
 * sur fetch externe (bot-check Unsplash, timeout, etc).
 */
async function readCoverAsDataUrl(cover: string): Promise<string | undefined> {
  if (!cover.startsWith("/")) return undefined;
  try {
    const absolute = join(process.cwd(), "public", cover);
    const buf = await readFile(absolute);
    const ext = cover.split(".").pop()?.toLowerCase() ?? "jpg";
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "Note introuvable";
  const category = article?.category ?? "";
  const readTime = article?.readTime ?? "";
  const excerpt = article?.excerpt ?? "";
  const tags = article?.tags ?? [];
  const accent = CATEGORY_ACCENTS[category] ?? DEFAULT_ACCENT;
  const coverDataUrl = article?.cover ? await readCoverAsDataUrl(article.cover) : undefined;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        backgroundImage: coverDataUrl
          ? `linear-gradient(135deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.65) 100%), url(${coverDataUrl})`
          : "linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #0a0a0b 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#f5f5f5",
      }}
    >
      {/* Top — logo + category */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            fontFamily: "monospace",
          }}
        >
          VH<span style={{ color: accent }}>.</span>
        </div>
        {category && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${accent}55`,
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 14,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: accent,
            }}
          >
            {category}
          </div>
        )}
      </div>

      {/* Center — title + excerpt */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 980,
            color: accent,
            display: "flex",
          }}
        >
          {title}
        </div>
        {excerpt && (
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              maxWidth: 900,
              color: "rgba(245,245,245,0.7)",
              display: "flex",
            }}
          >
            {excerpt}
          </div>
        )}
      </div>

      {/* Bottom — tags + author + read time */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(245,245,245,0.15)",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 14,
                fontFamily: "monospace",
                color: "rgba(245,245,245,0.55)",
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 16, color: "rgba(245,245,245,0.5)" }}>vincenthirtz.fr</div>
          {readTime && (
            <div
              style={{
                fontSize: 14,
                fontFamily: "monospace",
                color: "rgba(245,245,245,0.4)",
                letterSpacing: "0.1em",
                padding: "6px 12px",
                border: "1px solid rgba(245,245,245,0.15)",
                borderRadius: 999,
              }}
            >
              {readTime}
            </div>
          )}
        </div>
      </div>
    </div>,
    { ...size },
  );
}

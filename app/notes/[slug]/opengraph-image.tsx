import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

// Runtime nodejs (pas edge) : satori doit pouvoir fetcher l'image de couverture
// Unsplash pendant la génération. L'edge runtime Netlify avait des problèmes
// de fetch qui faisaient planter la route en 500.
export const runtime = "nodejs";
export const alt = "Article — Vincent Hirtz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Palette d'accents par catégorie (cohérente avec les thèmes du site). */
const CATEGORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  Debug: { accent: "#ff6b6b", glow: "rgba(255,107,107,0.18)" },
  Tests: { accent: "#7afcff", glow: "rgba(122,252,255,0.18)" },
  Architecture: { accent: "#c084fc", glow: "rgba(192,132,252,0.18)" },
  "Open Source": { accent: "#ffb347", glow: "rgba(255,179,71,0.18)" },
};
const DEFAULT_ACCENT = { accent: "#c8ff00", glow: "rgba(200,255,0,0.18)" };

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "Note introuvable";
  const category = article?.category ?? "";
  const readTime = article?.readTime ?? "";
  const excerpt = article?.excerpt ?? "";
  const tags = article?.tags ?? [];
  const cover = article?.cover;
  const { accent, glow } = CATEGORY_ACCENTS[category] ?? DEFAULT_ACCENT;

  // Pré-fetch l'image Unsplash en data URL — si le fetch échoue (bot-check,
  // timeout…), on retombe gracieusement sur le gradient de catégorie au lieu
  // de faire planter la route en 500.
  let coverDataUrl: string | undefined;
  if (cover) {
    try {
      const res = await fetch(cover, {
        headers: { "User-Agent": "Mozilla/5.0 vincenthirtz.fr-og" },
      });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const contentTypeHeader = res.headers.get("content-type") ?? "image/jpeg";
        coverDataUrl = `data:${contentTypeHeader};base64,${Buffer.from(buf).toString("base64")}`;
      }
    } catch {
      // Fallback au gradient — on logge silencieusement pour ne pas casser la route
    }
  }

  const fallbackBackground = `linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #0a0a0b 100%)`;
  // Si on a réussi à pré-fetcher le cover, on l'utilise en fond avec un
  // overlay sombre ; sinon gradient simple par catégorie (glow radial retiré
  // car satori le supporte mal dans certains runtimes).
  const background = coverDataUrl
    ? `linear-gradient(135deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.65) 100%), url(${coverDataUrl})`
    : fallbackBackground;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        backgroundImage: background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#f5f5f5",
      }}
    >
      {/* Glow par catégorie (seulement sans cover, car radial-gradient
          superposé à un bg-image peut crasher satori). */}
      {!coverDataUrl && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: `radial-gradient(circle at 85% 20%, ${glow} 0%, transparent 55%)`,
          }}
        />
      )}
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
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
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

import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

export const runtime = "edge";
export const alt = "Article — Vincent Hirtz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "Note introuvable";
  const category = article?.category ?? "";
  const readTime = article?.readTime ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #0a0a0b 100%)",
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
          VH<span style={{ color: "#c8ff00" }}>.</span>
        </div>
        {category && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(200,255,0,0.3)",
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 14,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "rgba(245,245,245,0.6)",
            }}
          >
            {category}
          </div>
        )}
      </div>

      {/* Center — article title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            color: "#c8ff00",
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom — author + read time */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontSize: 18,
            color: "rgba(245,245,245,0.5)",
          }}
        >
          Vincent Hirtz — Notes
        </div>
        {readTime && (
          <div
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              color: "rgba(245,245,245,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            {readTime}
          </div>
        )}
      </div>
    </div>,
    { ...size },
  );
}

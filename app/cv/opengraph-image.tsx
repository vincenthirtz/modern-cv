import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CV de Vincent Hirtz — Lead Developer Front-End";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
      {/* Top — logo + badge CV */}
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
          Curriculum Vitae
        </div>
      </div>

      {/* Center — name + role */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Vincent <span style={{ color: "#c8ff00" }}>Hirtz</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(245,245,245,0.5)",
            lineHeight: 1.4,
          }}
        >
          Lead Developer Front-End · 10+ ans d&apos;expérience
        </div>
      </div>

      {/* Bottom — skills + location */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["React", "Vue.js", "Angular", "TypeScript", "Node.js"].map((tag) => (
            <div
              key={tag}
              style={{
                border: "1px solid rgba(200,255,0,0.25)",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 14,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(245,245,245,0.6)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 16,
            fontFamily: "monospace",
            color: "rgba(245,245,245,0.4)",
            letterSpacing: "0.1em",
          }}
        >
          Lyon, France
        </div>
      </div>
    </div>,
    { ...size },
  );
}

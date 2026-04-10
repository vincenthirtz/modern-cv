import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vincent Hirtz — Lead Developer & Architecte Logiciel";
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
      {/* Top — logo + badge */}
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
            gap: 8,
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
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          Disponible pour missions
        </div>
      </div>

      {/* Center — title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 800,
          }}
        >
          Lead Developer & <span style={{ color: "#c8ff00" }}>Architecte Logiciel</span>
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(245,245,245,0.5)",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          10+ ans d&apos;expérience React, Vue et Angular. Créateur de Pulse JS Framework.
        </div>
      </div>

      {/* Bottom — tech tags + location */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["React", "Vue.js", "TypeScript", "Next.js"].map((tag) => (
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
          Lyon, France · vincenthirtz.fr
        </div>
      </div>
    </div>,
    { ...size },
  );
}

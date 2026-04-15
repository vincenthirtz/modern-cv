"use client";

import { useState } from "react";

/**
 * Palette des thèmes — calquée sur le style des icônes Adobe Creative Suite.
 * Chaque carte représente un accent du site avec son abréviation à deux lettres,
 * ses couleurs et un usage décrit.
 */

const THEMES = [
  {
    abbr: "Lm",
    name: "Lime",
    subtitle: "Défaut · Énergie",
    color: "#c8ff00",
    soft: "#d9ff4d",
    contrast: "#1a1a1a",
    bg: "#0d0f00",
    usage: "Accent principal du portfolio. Dynamique, tech, lisible sur fond sombre.",
  },
  {
    abbr: "Cy",
    name: "Cyan",
    subtitle: "Frost · Clarté",
    color: "#00e5ff",
    soft: "#4df0ff",
    contrast: "#0a1a1f",
    bg: "#001519",
    usage: "Évoque la précision et la clarté technique. Idéal pour les interfaces data.",
  },
  {
    abbr: "Rs",
    name: "Rose",
    subtitle: "Bold · Impact",
    color: "#ff3c82",
    soft: "#ff6fa3",
    contrast: "#ffffff",
    bg: "#19000b",
    usage: "Vibrant et expressif. Apporte de la chaleur humaine au design technique.",
  },
  {
    abbr: "Or",
    name: "Orange",
    subtitle: "Warm · Créatif",
    color: "#ff8a00",
    soft: "#ffaa40",
    contrast: "#1a1200",
    bg: "#150d00",
    usage: "Chaleureux et accessible. Équilibre entre professionnalisme et créativité.",
  },
  {
    abbr: "Vi",
    name: "Violet",
    subtitle: "Soft · Élégant",
    color: "#a78bfa",
    soft: "#c4b5fd",
    contrast: "#1a1530",
    bg: "#0e0b1a",
    usage: "Sophistiqué et apaisant. Pour les contextes premium et réflexifs.",
  },
] as const;

const FONTS = [
  {
    name: "Instrument Serif",
    variable: "--font-serif",
    sample: "VH",
    usage: "Titres, branding",
    className: "font-serif",
  },
  {
    name: "DM Sans",
    variable: "--font-sans",
    sample: "Aa Bb Cc",
    usage: "Corps de texte",
    className: "font-sans",
  },
  {
    name: "JetBrains Mono",
    variable: "--font-mono",
    sample: "01 {}",
    usage: "Code, labels",
    className: "font-mono",
  },
];

export default function BrandingGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-24">
      {/* Grille des thèmes style Adobe */}
      <section>
        <div className="mb-8 flex items-center gap-3">
          <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Thèmes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {THEMES.map((theme, i) => (
            <div
              key={theme.name}
              className="group relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                borderColor: hoveredIndex === i ? theme.color : "var(--border-strong)",
                background: theme.bg,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Carte principale — ratio carré */}
              <div className="relative flex aspect-square flex-col justify-between p-5">
                {/* Halo subtil */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${theme.color}15, transparent 70%)`,
                  }}
                />

                {/* En-tête : nom + bordure accent */}
                <div className="relative z-10">
                  <div
                    className="mb-1 inline-block rounded-sm border-l-2 pl-2 font-mono text-[0.625rem] uppercase tracking-widest"
                    style={{ borderColor: theme.color, color: theme.soft }}
                  >
                    {theme.name}
                  </div>
                  <div
                    className="font-mono text-[0.5625rem] tracking-wide"
                    style={{ color: theme.soft }}
                  >
                    {theme.subtitle}
                  </div>
                </div>

                {/* Abréviation centrale style Adobe */}
                <div className="relative z-10 flex flex-1 items-center justify-center">
                  <span
                    className="font-serif text-[clamp(3rem,8vw,5.5rem)] leading-none tracking-tight transition-transform duration-300 group-hover:scale-110"
                    style={{ color: theme.color }}
                  >
                    {theme.abbr}
                  </span>
                </div>

                {/* Swatches en bas */}
                <div className="relative z-10 flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-sm"
                    style={{ background: theme.color }}
                    title={`Principal : ${theme.color}`}
                  />
                  <div
                    className="h-4 w-4 rounded-sm"
                    style={{ background: theme.soft }}
                    title={`Soft : ${theme.soft}`}
                  />
                  <div
                    className="h-4 w-4 rounded-sm border"
                    style={{
                      background: theme.contrast,
                      borderColor: `${theme.color}40`,
                    }}
                    title={`Contraste : ${theme.contrast}`}
                  />
                  <span
                    className="ml-auto font-mono text-[0.5625rem] tracking-wider"
                    style={{ color: theme.soft }}
                  >
                    {theme.color}
                  </span>
                </div>
              </div>

              {/* Description au hover */}
              <div
                className="border-t px-5 py-3 transition-all duration-300"
                style={{
                  borderColor: `${theme.color}20`,
                  maxHeight: hoveredIndex === i ? "120px" : "0px",
                  opacity: hoveredIndex === i ? 1 : 0,
                  paddingTop: hoveredIndex === i ? "12px" : "0px",
                  paddingBottom: hoveredIndex === i ? "12px" : "0px",
                  overflow: "hidden",
                }}
              >
                <p
                  className="text-[0.6875rem] leading-relaxed"
                  style={{ color: theme.soft, opacity: 0.7 }}
                >
                  {theme.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typographies */}
      <section>
        <div className="mb-8 flex items-center gap-3">
          <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Typographies
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FONTS.map((font) => (
            <div key={font.name} className="card group flex flex-col justify-between p-6">
              <div>
                <div className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-accent)]">
                  {font.usage}
                </div>
                <div className="mt-1 text-sm text-[var(--fg-muted)]">{font.name}</div>
                <div className="mt-1 font-mono text-[0.5625rem] text-[var(--fg-dim)]">
                  var({font.variable})
                </div>
              </div>
              <div
                className={`mt-6 text-5xl text-[var(--fg)] transition-colors group-hover:text-[var(--color-accent)] ${font.className}`}
              >
                {font.sample}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tokens */}
      <section>
        <div className="mb-8 flex items-center gap-3">
          <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Tokens
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { name: "ink", var: "--color-ink", value: "#0a0a0b" },
            { name: "ink-soft", var: "--color-ink-soft", value: "#111114" },
            { name: "elevated", var: "--color-ink-elevated", value: "#16161a" },
            { name: "bone", var: "--color-bone", value: "#f0efe9" },
            { name: "bone-muted", var: "--color-bone-muted", value: "#a8a79f" },
            { name: "bone-dim", var: "--color-bone-dim", value: "#8a8980" },
          ].map((token) => (
            <div key={token.name} className="space-y-2">
              <div
                className="aspect-[3/2] rounded-lg border"
                style={{ background: token.value, borderColor: "var(--border-strong)" }}
              />
              <div className="font-mono text-[0.625rem] text-[var(--fg)]">{token.name}</div>
              <div className="font-mono text-[0.5625rem] text-[var(--fg-dim)]">{token.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

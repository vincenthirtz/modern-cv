"use client";

import { useEffect, useRef, useState } from "react";
import { useAnnounce } from "./A11yAnnouncer";

/**
 * Palette d'accents.
 * Chaque accent dispose d'une variante `light*` ajustée pour le mode clair
 * afin de respecter un ratio de contraste WCAG AA (≥ 4.5:1 texte, ≥ 3:1 UI)
 * contre le fond paper #f5f4ee.
 */
const ACCENTS = [
  {
    name: "Lime",
    color: "#c8ff00",
    soft: "#d9ff4d",
    contrast: "#1a1a1a",
    fg: "#5a7a00",
    lightColor: "#4a7a00",
    lightSoft: "#6b9a00",
  },
  {
    name: "Cyan",
    color: "#00e5ff",
    soft: "#4df0ff",
    contrast: "#0a1a1f",
    fg: "#007a8a",
    lightColor: "#007a8a",
    lightSoft: "#009aaa",
  },
  {
    name: "Rose",
    color: "#ff3c82",
    soft: "#ff6fa3",
    contrast: "#ffffff",
    fg: "#d42265",
    lightColor: "#d42265",
    lightSoft: "#e8447f",
  },
  {
    name: "Orange",
    color: "#ff8a00",
    soft: "#ffaa40",
    contrast: "#1a1200",
    fg: "#b86200",
    lightColor: "#b86200",
    lightSoft: "#d07400",
  },
  {
    name: "Violet",
    color: "#a78bfa",
    soft: "#c4b5fd",
    contrast: "#1a1530",
    fg: "#6d47d9",
    lightColor: "#6d47d9",
    lightSoft: "#8660ec",
  },
] as const;

export type AccentName = (typeof ACCENTS)[number]["name"];

function applyAccent(accent: (typeof ACCENTS)[number]) {
  const s = document.documentElement.style;
  s.setProperty("--color-accent", accent.color);
  s.setProperty("--color-accent-soft", accent.soft);
  s.setProperty("--color-accent-contrast", accent.contrast);
  s.setProperty("--color-accent-fg", accent.fg);
  s.setProperty("--color-accent-light", accent.lightColor);
  s.setProperty("--color-accent-light-soft", accent.lightSoft);
}

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const announce = useAnnounce();

  // Lire le choix persisté au montage
  useEffect(() => {
    const stored = localStorage.getItem("accent");
    const match = ACCENTS.find((a) => a.name === stored);
    setActive((match ?? ACCENTS[0]).color);
    if (match) applyAccent(match);
  }, []);

  // Fermer le panneau au clic extérieur
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [open]);

  // Fermer au clavier Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function pick(accent: (typeof ACCENTS)[number]) {
    setActive(accent.color);
    applyAccent(accent);
    localStorage.setItem("accent", accent.name);
    setOpen(false);
    announce(`Couleur d'accentuation : ${accent.name}`);
  }

  if (active === null) {
    return (
      <div className="relative">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
        />
      </div>
    );
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bouton déclencheur : pastille de la couleur active */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Changer la couleur d'accentuation"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--elevated)",
        }}
      >
        <span
          className="block h-4 w-4 rounded-full ring-1 ring-white/20"
          style={{ background: active }}
        />
      </button>

      {/* Palette déroulante */}
      <div
        className="absolute right-0 top-full mt-2 flex gap-2 rounded-full border px-3 py-2"
        style={{
          background: "var(--elevated)",
          borderColor: "var(--border-strong)",
          boxShadow: "0 12px 40px -10px var(--dock-shadow, rgba(0,0,0,0.5))",
          opacity: open ? 1 : 0,
          transform: open ? "scale(1) translateY(0)" : "scale(0.9) translateY(-4px)",
          transition: "opacity 0.15s ease, transform 0.15s ease, visibility 0.15s",
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
        role="radiogroup"
        aria-label="Couleur d'accentuation"
      >
        {ACCENTS.map((accent) => {
          const isActive = active === accent.color;
          return (
            <button
              key={accent.name}
              onClick={() => pick(accent)}
              role="radio"
              aria-checked={isActive}
              aria-label={accent.name}
              tabIndex={open ? 0 : -1}
              className="relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{ background: accent.color }}
            >
              {isActive && (
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{ background: "var(--color-ink)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

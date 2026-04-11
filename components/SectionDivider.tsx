"use client";

import { useEffect, useRef } from "react";

interface SectionDividerProps {
  /** Numéro de la section qui suit, ex "02" */
  number?: string;
  /** Label de la section qui suit, ex "expertise" */
  next?: string;
  /** Variante visuelle */
  variant?: "line" | "marker" | "minimal";
}

/**
 * Divider animé placé entre deux sections.
 * Lignes qui se tracent, losange rotatif, label discret.
 */
export default function SectionDivider({ number, next, variant = "line" }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLSpanElement>(null);
  const rightLineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const minLineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      const current = vh - rect.top;
      const progress = Math.max(0, Math.min(1, current / total));

      const rotate = -45 + progress * 180;
      const lineScale = Math.max(0, Math.min(1, (progress - 0.3) / 0.3));
      let labelOpacity: number;
      if (progress < 0.3) labelOpacity = 0;
      else if (progress < 0.5) labelOpacity = (progress - 0.3) / 0.2;
      else if (progress < 0.7) labelOpacity = 1;
      else if (progress < 0.9) labelOpacity = 1 - (progress - 0.7) / 0.2;
      else labelOpacity = 0;

      if (diamondRef.current) diamondRef.current.style.transform = `rotate(${rotate}deg)`;
      if (leftLineRef.current) leftLineRef.current.style.transform = `scaleX(${lineScale})`;
      if (rightLineRef.current) rightLineRef.current.style.transform = `scaleX(${lineScale})`;
      if (labelRef.current) labelRef.current.style.opacity = String(labelOpacity);
      if (minLineRef.current) minLineRef.current.style.transform = `scaleX(${lineScale})`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (variant === "minimal") {
    return (
      <div
        ref={ref}
        aria-hidden
        className="relative mx-auto flex h-24 max-w-6xl items-center justify-center px-6"
      >
        <span
          ref={minLineRef}
          className="block h-[1px] w-full origin-center bg-[var(--border-strong)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto flex h-32 max-w-6xl items-center justify-center px-6 md:h-40"
    >
      {/* Ligne gauche */}
      <span
        ref={leftLineRef}
        className="block h-[1px] flex-1 origin-right"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(to right, transparent, var(--border-strong) 70%, var(--color-accent))",
        }}
      />

      {/* Marker central — losange rotatif */}
      <div className="relative mx-6 flex flex-col items-center">
        <div
          ref={diamondRef}
          className="relative h-3 w-3 md:h-4 md:w-4"
          style={{ transform: "rotate(-45deg)" }}
        >
          <span aria-hidden className="absolute inset-0 block bg-[var(--color-accent)]" />
          <span
            aria-hidden
            className="absolute -inset-2 block animate-pulse rounded-full bg-[var(--color-accent)] opacity-20 blur-md"
          />
        </div>

        {/* Label section suivante */}
        {(number || next) && (
          <div
            ref={labelRef}
            className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
            style={{ opacity: 0 }}
          >
            <span className="block h-[1px] w-3 bg-[var(--color-accent)]" />
            {number && <span className="text-[var(--color-accent)]">{number}</span>}
            {next && <span>{next}</span>}
            <span className="text-[var(--fg-dim)]">↓</span>
          </div>
        )}
      </div>

      {/* Ligne droite */}
      <span
        ref={rightLineRef}
        className="block h-[1px] flex-1 origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(to left, transparent, var(--border-strong) 70%, var(--color-accent))",
        }}
      />
    </div>
  );
}

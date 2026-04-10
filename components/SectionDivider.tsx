"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

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
 *
 * - Deux lignes qui se tracent depuis le centre vers l'extérieur
 * - Un losange rotatif au centre, dont la rotation est liée au scroll
 * - Un label discret en monospace indiquant la section qui suit ("↓ 02 / expertise")
 *
 * Le divider est lui-même un repère visuel rythmique entre les sections,
 * pas un séparateur fonctionnel.
 */
export default function SectionDivider({
  number,
  next,
  variant = "line",
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Le losange tourne en fonction du scroll : 0deg en bas du viewport, 180deg en haut
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 135]);
  // Les lignes scale-X de 0 à 1 quand le divider entre dans le viewport
  const lineScale = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  // Opacity du label fade in/out
  const labelOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7, 0.9],
    [0, 1, 1, 0],
  );

  if (variant === "minimal") {
    return (
      <div
        ref={ref}
        aria-hidden
        className="relative mx-auto flex h-24 max-w-6xl items-center justify-center px-6"
      >
        <motion.span
          style={{ scaleX: lineScale }}
          className="block h-[1px] w-full origin-center bg-[var(--border-strong)]"
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
      <motion.span
        style={{
          scaleX: lineScale,
          background:
            "linear-gradient(to right, transparent, var(--border-strong) 70%, var(--color-accent))",
        }}
        className="block h-[1px] flex-1 origin-right"
      />

      {/* Marker central — losange rotatif */}
      <div className="relative mx-6 flex flex-col items-center">
        <motion.div
          style={{ rotate }}
          className="relative h-3 w-3 md:h-4 md:w-4"
        >
          <span
            aria-hidden
            className="absolute inset-0 block bg-[var(--color-accent)]"
          />
          <span
            aria-hidden
            className="absolute -inset-2 block animate-pulse rounded-full bg-[var(--color-accent)] opacity-20 blur-md"
          />
        </motion.div>

        {/* Label section suivante */}
        {(number || next) && (
          <motion.div
            style={{ opacity: labelOpacity }}
            className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
          >
            <span className="block h-[1px] w-3 bg-[var(--color-accent)]" />
            {number && <span className="text-[var(--color-accent)]">{number}</span>}
            {next && <span>{next}</span>}
            <span className="text-[var(--fg-dim)]">↓</span>
          </motion.div>
        )}
      </div>

      {/* Ligne droite */}
      <motion.span
        style={{
          scaleX: lineScale,
          background:
            "linear-gradient(to left, transparent, var(--border-strong) 70%, var(--color-accent))",
        }}
        className="block h-[1px] flex-1 origin-left"
      />
    </div>
  );
}

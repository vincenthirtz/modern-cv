"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffectsMode } from "./EffectsProvider";

/**
 * Fond fixe qui interpole entre plusieurs nuances de noir/bleu/violet en
 * fonction de la progression de scroll. Donne un sentiment de "voyage"
 * subtil tout au long de la page sans casser l'identité dark.
 *
 * Placé en z-0 derrière `<main>` (qui est en z-2 dans page.tsx).
 * Désactivé en mode reduced effects.
 */
export default function BackgroundShift() {
  const { reduced } = useEffectsMode();
  const { scrollYProgress } = useScroll();

  // 5 stops répartis sur la page — variations très subtiles autour du noir
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#0a0a0b", "#0b0a12", "#0a0d14", "#0c0a14", "#0a0c12", "#0a0a0b"],
  );

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor }}
    />
  );
}

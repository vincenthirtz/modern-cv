"use client";

import type { ReactNode } from "react";
import useInViewCSS from "./useInViewCSS";

interface SectionTransitionProps {
  children: ReactNode;
  /** Petit délai en secondes pour échelonner plusieurs sections en cascade */
  delay?: number;
}

/**
 * Wrapper qui ajoute une transition d'entrée élégante à une section :
 *
 * - Clip-path qui se "ouvre" du haut vers le bas (effet de rideau)
 * - Léger lift vertical (60px → 0)
 * - Fade in subtil
 *
 * Le tout joué une seule fois quand la section entre dans le viewport.
 * Utilise CSS natif + IntersectionObserver au lieu de Framer Motion.
 *
 * Respecte prefers-reduced-motion via la media query dans globals.css.
 */
export default function SectionTransition({ children, delay = 0 }: SectionTransitionProps) {
  const { ref, inView } = useInViewCSS({ amount: 0.1, rootMargin: "-10% 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className={inView ? "anim-section-reveal" : ""}
      style={{
        opacity: inView ? undefined : 0,
        animationDelay: delay ? `${delay}s` : undefined,
        willChange: inView ? undefined : "transform, opacity, clip-path",
        contentVisibility: "auto",
        containIntrinsicSize: "auto 600px",
      }}
    >
      {children}
    </div>
  );
}

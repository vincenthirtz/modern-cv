"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

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
 * Le tout joué une seule fois quand la section entre dans le viewport,
 * avec une marge négative pour anticiper l'animation avant l'arrivée
 * complète.
 *
 * Les animations internes des composants enfants continuent de jouer
 * par-dessus, créant une cascade naturelle.
 */
export default function SectionTransition({
  children,
  delay = 0,
}: SectionTransitionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    // Respecte la préférence : pas d'animation, juste le rendu direct
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 60,
        clipPath: "inset(15% 0% 0% 0% round 0px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0% round 0px)",
      }}
      viewport={{
        once: true,
        margin: "-10% 0px -10% 0px",
      }}
      transition={{
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo doux
        delay,
      }}
      style={{ willChange: "transform, opacity, clip-path" }}
    >
      {children}
    </motion.div>
  );
}

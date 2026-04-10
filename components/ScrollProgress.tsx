"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Barre de progression de scroll fine en haut de page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(to right, var(--color-accent), var(--color-accent-soft))",
      }}
    />
  );
}

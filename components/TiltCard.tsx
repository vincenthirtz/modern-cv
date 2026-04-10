"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Amplitude max de rotation en degrés (par défaut 6 — subtil) */
  intensity?: number;
  /** Activer la lueur "spotlight" qui suit le curseur */
  spotlight?: boolean;
}

/**
 * Wrapper qui applique un effet de tilt 3D sur le contenu en suivant le curseur.
 * Utilise des springs pour un mouvement naturel.
 *
 * - Désactivé sur prefers-reduced-motion
 * - GPU-accéléré (transform + will-change)
 * - Spotlight optionnel : un halo lumineux qui suit la souris à l'intérieur
 */
export default function TiltCard({
  children,
  className = "",
  intensity = 6,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Position normalisée [-0.5, 0.5] sur les deux axes
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 200, damping: 20, mass: 0.5 });

  // Inversion sur Y pour que le haut "se lève" et le bas "s'enfonce"
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);

  // Position du spotlight en pourcentage
  const spotX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  // Gradient dérivé pour le spotlight (motion template)
  const spotlightBg = useTransform(
    [spotX, spotY] as never,
    ([x, y]: string[]) =>
      `radial-gradient(400px circle at ${x} ${y}, rgba(200,255,0,0.12), transparent 60%)`,
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      {/* Spotlight qui suit le curseur — pointer-events:none pour ne pas bloquer */}
      {spotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: spotlightBg }}
        />
      )}
    </motion.div>
  );
}

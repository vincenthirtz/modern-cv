"use client";

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
 * Désactivé sur prefers-reduced-motion, GPU-accéléré.
 */
export default function TiltCard({
  children,
  className = "",
  intensity = 6,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -py * intensity * 2;
    const rotateY = px * intensity * 2;
    ref.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    if (spotRef.current) {
      const spotX = (px + 0.5) * 100;
      const spotY = (py + 0.5) * 100;
      spotRef.current.style.background = `radial-gradient(400px circle at ${spotX}% ${spotY}%, rgba(200,255,0,0.12), transparent 60%)`;
    }
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      {children}
      {spotlight && (
        <div
          ref={spotRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
    </div>
  );
}

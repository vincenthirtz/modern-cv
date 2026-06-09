"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectsMode } from "./EffectsProvider";

/**
 * Halo lumineux qui suit le curseur en arrière-plan avec un léger délai.
 * Désactivé sur les appareils tactiles et avec prefers-reduced-motion.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const { reduced } = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;
    setEnabled(true);

    // Throttle via rAF : un seul repositionnement par frame, peu importe
    // le nombre d'événements mousemove émis (60+/s sur certaines souris).
    let ticking = false;
    let x = 0;
    let y = 0;

    function apply() {
      ticking = false;
      if (!ref.current) return;
      ref.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    function onMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled || reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] cursor-glow"
      style={{
        transform: "translate(-200px, -200px) translate(-50%, -50%)",
        transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: 480,
          height: 480,
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, color-mix(in oklab, var(--color-accent) 5%, transparent) 30%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffectsMode } from "./EffectsProvider";

/**
 * Halo lumineux qui suit le curseur en arrière-plan avec un léger délai.
 * Désactivé sur les appareils tactiles et avec prefers-reduced-motion.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const { reduced } = useEffectsMode();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // Spring pour un effet "trainée" smooth
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div
        style={{
          width: 480,
          height: 480,
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(200,255,0,0.18) 0%, rgba(200,255,0,0.05) 30%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />
    </motion.div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useEffectsMode } from "./EffectsProvider";

const COLORS = ["#0a0a0b", "#0b0a12", "#0a0d14", "#0c0a14", "#0a0c12", "#0a0a0b"];
const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function interpolateColor(progress: number): string {
  let i = 0;
  for (; i < STOPS.length - 1; i++) {
    if (progress <= STOPS[i + 1]) break;
  }
  const t = (progress - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
  const [r1, g1, b1] = hexToRgb(COLORS[i]);
  const [r2, g2, b2] = hexToRgb(COLORS[Math.min(i + 1, COLORS.length - 1)]);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Fond fixe qui interpole entre plusieurs nuances de noir/bleu/violet en
 * fonction de la progression de scroll.
 */
export default function BackgroundShift() {
  const { reduced } = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    function onScroll() {
      if (!ref.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const progress = max <= 0 ? 0 : scrollTop / max;
      ref.current.style.backgroundColor = interpolateColor(progress);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: COLORS[0] }}
    />
  );
}

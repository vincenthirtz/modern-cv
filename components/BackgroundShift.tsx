"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectsMode } from "./EffectsProvider";

const DARK_COLORS = ["#0a0a0b", "#0b0a12", "#0a0d14", "#0c0a14", "#0a0c12", "#0a0a0b"];
const LIGHT_COLORS = ["#f5f4ee", "#f2f1ea", "#efeee6", "#f0efe8", "#f3f2eb", "#f5f4ee"];
const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function interpolateColor(progress: number, colors: string[]): string {
  let i = 0;
  for (; i < STOPS.length - 1; i++) {
    if (progress <= STOPS[i + 1]) break;
  }
  const t = (progress - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
  const [r1, g1, b1] = hexToRgb(colors[i]);
  const [r2, g2, b2] = hexToRgb(colors[Math.min(i + 1, colors.length - 1)]);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Fond fixe qui interpole entre plusieurs nuances en
 * fonction de la progression de scroll.
 * S'adapte au thème dark/light.
 */
export default function BackgroundShift() {
  const { reduced } = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    function checkTheme() {
      setIsLight(document.documentElement.classList.contains("light"));
    }
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const colors = isLight ? LIGHT_COLORS : DARK_COLORS;
    function onScroll() {
      if (!ref.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const progress = max <= 0 ? 0 : scrollTop / max;
      ref.current.style.backgroundColor = interpolateColor(progress, colors);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, isLight]);

  if (reduced) return null;

  const colors = isLight ? LIGHT_COLORS : DARK_COLORS;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: colors[0] }}
    />
  );
}

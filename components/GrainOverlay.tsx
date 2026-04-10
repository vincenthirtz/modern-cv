"use client";

import { useEffectsMode } from "./EffectsProvider";

/**
 * Grain SVG en overlay sur toute la page pour donner de la texture.
 * Pointer-events désactivés et z-index élevé pour rester au-dessus.
 * Désactivé en mode reduced effects.
 */
export default function GrainOverlay() {
  const { reduced } = useEffectsMode();
  if (reduced) return null;
  return (
    <div
      aria-hidden
      className="bg-noise pointer-events-none fixed inset-0 z-[55] opacity-[0.18] mix-blend-overlay"
    />
  );
}

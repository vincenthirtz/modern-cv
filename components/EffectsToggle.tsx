"use client";

import { motion } from "framer-motion";
import { useEffectsMode } from "./EffectsProvider";

/**
 * Toggle pour activer/désactiver les effets visuels lourds (cursor follower,
 * grain, background shift, animations Framer). Ciblé pour les machines
 * modestes ou les utilisateurs qui préfèrent une expérience apaisée.
 */
export default function EffectsToggle() {
  const { reduced, toggle } = useEffectsMode();

  return (
    <button
      onClick={toggle}
      aria-pressed={reduced}
      aria-label={
        reduced
          ? "Réactiver les effets visuels"
          : "Activer le mode lecture (désactive les effets visuels)"
      }
      title={reduced ? "Mode lecture activé" : "Mode lecture"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
      style={{
        borderColor: "var(--border-strong)",
        background: reduced ? "var(--color-accent)" : "var(--elevated)",
        color: reduced ? "var(--color-ink)" : "var(--fg)",
      }}
    >
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: reduced ? 0 : 0 }}
      >
        {/* Icône "spark off / sparkle" — sparkle quand actif, sparkle barré quand reduced */}
        {reduced ? (
          // Mode lecture activé : icône livre
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </>
        ) : (
          // Mode normal : icône étincelles
          <>
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          </>
        )}
      </motion.svg>
    </button>
  );
}

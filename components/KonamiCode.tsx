"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Easter egg : Konami Code → active un mode "rainbow" temporaire avec
 * confettis CSS et inverse les couleurs d'accent.
 */
export default function KonamiCode() {
  const [active, setActive] = useState(false);
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    let buffer: string[] = [];

    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      const matches = buffer.every((k, i) => k === SEQUENCE[i]);
      setProgress(matches ? buffer.length : 0);
      if (matches && buffer.length === SEQUENCE.length) {
        setActive(true);
        document.documentElement.style.setProperty("--color-accent", "#ff00d4");
        setTimeout(() => {
          setActive(false);
          document.documentElement.style.removeProperty("--color-accent");
        }, 6000);
        buffer = [];
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-full border px-6 py-3 font-mono text-sm uppercase tracking-widest"
          style={{
            background: "var(--elevated)",
            borderColor: "#ff00d4",
            color: "#ff00d4",
            boxShadow: "0 0 60px rgba(255, 0, 212, 0.5)",
          }}
        >
          ⬆⬆⬇⬇⬅➡⬅➡ B A — Cheat mode activé
        </motion.div>
      )}
    </AnimatePresence>
  );
}

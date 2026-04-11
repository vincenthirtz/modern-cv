"use client";

import { useEffect, useState } from "react";

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
 * Easter egg : Konami Code → active un mode "rainbow" temporaire.
 */
export default function KonamiCode() {
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];

    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      const matches = buffer.every((k, i) => k === SEQUENCE[i]);
      if (matches && buffer.length === SEQUENCE.length) {
        setActive(true);
        setExiting(false);
        document.documentElement.style.setProperty("--color-accent", "#ff00d4");
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setActive(false);
            setExiting(false);
            document.documentElement.style.removeProperty("--color-accent");
          }, 300);
        }, 5700);
        buffer = [];
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-[100] rounded-full border px-6 py-3 font-mono text-sm uppercase tracking-widest"
      style={{
        background: "var(--elevated)",
        borderColor: "#ff00d4",
        color: "#ff00d4",
        boxShadow: "0 0 60px rgba(255, 0, 212, 0.5)",
        transform: exiting
          ? "translateX(-50%) translateY(40px) scale(0.9)"
          : "translateX(-50%) translateY(0) scale(1)",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      ⬆⬆⬇⬇⬅➡⬅➡ B A — Cheat mode activé
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAnnounce } from "./A11yAnnouncer";

/**
 * Toggle dark/light persisté en localStorage.
 * Évite le flash via le script inline dans layout.tsx.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);
  const announce = useAnnounce();

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "dark" | "light" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("light", stored === "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
    announce(next === "light" ? "Mode clair activé" : "Mode sombre activé");
  }

  if (theme === null) {
    // Rendu placeholder avant hydratation pour éviter le mismatch
    return (
      <span
        className="relative inline-flex h-9 w-16 items-center rounded-full border"
        style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className="relative inline-flex h-9 w-16 items-center rounded-full border transition-colors"
      style={{
        borderColor: "var(--border-strong)",
        background: "var(--elevated)",
      }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute flex h-7 w-7 items-center justify-center rounded-full"
        style={{
          left: isDark ? 4 : "calc(100% - 32px)",
          background: isDark ? "var(--color-bone)" : "var(--color-accent)",
          color: "var(--color-ink)",
        }}
      >
        {isDark ? (
          // Icône lune
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          // Icône soleil
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </motion.span>
    </button>
  );
}

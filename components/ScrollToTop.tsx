"use client";

import { useEffect, useState } from "react";

/**
 * Bouton flottant « retour en haut » qui apparaît après 400px de scroll.
 *
 * N'utilise plus AnimatePresence car son animation exit provoquait un
 * "Cannot read properties of null (reading 'removeChild')" quand le
 * composant était démonté pendant une navigation (page.tsx → notes/[slug]).
 * Remplacé par une transition CSS classique.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollUp}
      aria-label="Retour en haut de page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border text-sm transition-all duration-250 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      style={{
        background: "var(--elevated)",
        borderColor: "var(--border-strong)",
        color: "var(--fg-muted)",
        backdropFilter: "blur(12px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(10px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}

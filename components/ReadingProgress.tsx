"use client";

import { useEffect, useRef } from "react";

/**
 * Barre fine en haut de page indiquant la progression de lecture.
 * Composant client isolé pour garder ArticleLayout SSR.
 */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const progress = max <= 0 ? 0 : scrollTop / max;
      ref.current.style.transform = `scaleX(${progress})`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        transform: "scaleX(0)",
        transition: "transform 0.1s linear",
        background: "linear-gradient(to right, var(--color-accent), var(--color-accent-soft))",
      }}
    />
  );
}

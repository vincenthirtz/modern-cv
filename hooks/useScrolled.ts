"use client";

import { useEffect, useState } from "react";

/**
 * Renvoie `true` dès que la page a scrollé au-delà de `threshold` pixels.
 * Utilise rAF + passive listener pour ne pas pénaliser le scroll.
 */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let rafId = 0;

    function update() {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return scrolled;
}

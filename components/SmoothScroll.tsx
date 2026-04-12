"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Active le smooth scroll global via Lenis.
 * Désactivé automatiquement si l'utilisateur préfère un mouvement réduit.
 *
 * Reset le scroll à 0 à chaque navigation client-side pour éviter
 * la désynchronisation entre Lenis et le router Next.js.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Création et destruction de l'instance Lenis
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll en haut de page à chaque changement de route
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Forcer le scroll à 0 immédiatement (pas d'animation)
    // `force: true` fonctionne même si Lenis est temporairement stoppé
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}

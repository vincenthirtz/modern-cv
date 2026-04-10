"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook minimaliste qui détecte l'entrée dans le viewport via IntersectionObserver.
 * Remplace le `whileInView` de Framer Motion pour les animations CSS pures.
 *
 * @param options.once - Ne déclencher qu'une seule fois (par défaut true)
 * @param options.amount - Fraction visible requise (par défaut 0.2)
 * @param options.rootMargin - Marge autour du viewport
 */
export default function useInViewCSS<T extends HTMLElement = HTMLDivElement>(options?: {
  once?: boolean;
  amount?: number;
  rootMargin?: string;
}) {
  const { once = true, amount = 0.2, rootMargin } = options ?? {};
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, amount, rootMargin]);

  return { ref, inView };
}

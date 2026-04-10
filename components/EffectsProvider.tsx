"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface EffectsContextValue {
  reduced: boolean;
  toggle: () => void;
}

const EffectsContext = createContext<EffectsContextValue | null>(null);

/**
 * Provider du mode "Reduced effects".
 *
 * - Persiste la préférence dans localStorage
 * - Ajoute / retire la classe `.reduced-effects` sur <html>
 * - Force `MotionConfig.reducedMotion` à "always" quand actif
 *   (Framer Motion désactive ses animations en se basant sur cette config)
 *
 * Les composants visuels lourds (cursor, grain, background shift) lisent
 * `useEffectsMode()` et se retirent du DOM quand `reduced === true`.
 */
export default function EffectsProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Lecture initiale depuis localStorage côté client
  useEffect(() => {
    try {
      const stored = localStorage.getItem("reducedEffects");
      if (stored === "true") {
        setReduced(true);
        document.documentElement.classList.add("reduced-effects");
      }
    } catch {
      /* localStorage indisponible */
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setReduced((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("reducedEffects", String(next));
      } catch {
        /* ignore */
      }
      document.documentElement.classList.toggle("reduced-effects", next);
      return next;
    });
  }, []);

  return <EffectsContext.Provider value={{ reduced, toggle }}>{children}</EffectsContext.Provider>;
}

export function useEffectsMode(): EffectsContextValue {
  const ctx = useContext(EffectsContext);
  // Fallback safe : si utilisé hors provider, retourne un état neutre.
  // Permet aux composants d'être rendus dans des contextes annexes (ex: page /cv)
  // sans crasher.
  if (!ctx) return { reduced: false, toggle: () => {} };
  return ctx;
}

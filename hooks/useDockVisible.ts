"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dock-visible";

/**
 * Persiste l'état "dock visible" dans localStorage.
 * Retourne l'état + un toggle stable.
 */
export function useDockVisible(initial = true): [boolean, () => void] {
  const [visible, setVisible] = useState(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "false") setVisible(false);
    } catch {
      /* SSR ou localStorage indisponible */
    }
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* localStorage indisponible */
      }
      return next;
    });
  }, []);

  return [visible, toggle];
}

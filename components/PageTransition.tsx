"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Transition d'entrée de page (fondu + léger glissement vertical).
 *
 * Utilise des transitions CSS pures au lieu de Framer Motion pour éviter
 * le bug "Cannot read properties of null (reading 'removeChild')" causé
 * par une race condition entre l'animation Framer Motion et le remplacement
 * du DOM par React lors de la navigation côté client.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const isFirst = useRef(true);

  useEffect(() => {
    // Pas d'animation au premier rendu (déjà visible via SSR)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // Reset invisible → visible sur chaque navigation
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 0.3s cubic-bezier(0.25,0.1,0.25,1), transform 0.3s cubic-bezier(0.25,0.1,0.25,1)",
      }}
    >
      {children}
    </div>
  );
}

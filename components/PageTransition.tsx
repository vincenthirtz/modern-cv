"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Transition d'entrée de page (fondu + léger glissement vertical).
 *
 * N'utilise PAS `key={pathname}` : ce pattern force React à démonter
 * tout l'arbre enfant à chaque navigation, ce qui détruit les composants
 * Link avant que Next.js finalise la navigation → premier clic perdu.
 *
 * À la place on re-déclenche l'animation via `useAnimationControls`
 * quand le pathname change, sans toucher au DOM.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimationControls();

  useEffect(() => {
    controls.set({ opacity: 0, y: 12 });
    controls.start({ opacity: 1, y: 0 });
  }, [pathname, controls]);

  return (
    <motion.div
      animate={controls}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

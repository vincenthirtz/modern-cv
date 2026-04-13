"use client";

import { useEffect } from "react";

/**
 * Remet le scroll en haut de page à chaque navigation client-side.
 *
 * Intercepte uniquement pushState (navigation) et popstate (back/forward).
 * Ne PAS intercepter replaceState : Next.js l'appelle en interne
 * (scroll restoration, état de route) ce qui provoque des remontées
 * intempestives du scroll.
 */
export default function ScrollReset() {
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    // Intercepter pushState (navigation client-side Next.js)
    const originalPushState = history.pushState.bind(history);
    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      originalPushState(...args);
      scrollToTop();
    };

    // Back/forward navigateur
    window.addEventListener("popstate", scrollToTop);

    return () => {
      history.pushState = originalPushState;
      window.removeEventListener("popstate", scrollToTop);
    };
  }, []);

  return null;
}

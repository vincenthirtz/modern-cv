"use client";

import { useEffect } from "react";

/**
 * Remet le scroll en haut de page à chaque navigation client-side.
 *
 * Utilise un patch natif sur history.pushState + popstate au lieu de
 * usePathname() pour ne pas dépendre de React (les erreurs removeChild
 * de React 19 peuvent corrompre les re-renders des hooks internes).
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

    // Intercepter replaceState (redirections Next.js)
    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      originalReplaceState(...args);
      scrollToTop();
    };

    // Back/forward navigateur
    window.addEventListener("popstate", scrollToTop);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", scrollToTop);
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/**
 * Génère un favicon SVG dynamique qui réagit au thème (dark/light)
 * et à la couleur d'accent choisie par l'utilisateur.
 *
 * Deux fixes pour garantir la mise à jour instantanée :
 * 1. Lire getComputedStyle (pas le style inline) pour avoir la couleur
 *    d'accent réelle après les overrides CSS du mode light.
 * 2. Supprimer puis recréer le <link> à chaque changement — certains
 *    navigateurs ignorent un simple changement de href sur un favicon existant.
 */
export default function DynamicFavicon() {
  useEffect(() => {
    function buildSvg(bg: string, accent: string): string {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${bg}"/><text x="16" y="22" font-family="ui-monospace,Menlo,monospace" font-size="16" font-weight="700" text-anchor="middle" fill="${accent}">VH</text></svg>`;
    }

    function updateFavicon() {
      const root = document.documentElement;
      const isLight = root.classList.contains("light");
      // getComputedStyle donne la valeur finale (après override CSS :root.light)
      const accent =
        getComputedStyle(root).getPropertyValue("--color-accent").trim() ||
        "#c8ff00";
      const bg = isLight ? "#f5f4ee" : "#0a0a0b";

      const href = `data:image/svg+xml,${encodeURIComponent(buildSvg(bg, accent))}`;

      // Supprimer tous les favicons existants pour forcer le navigateur à relire
      document
        .querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
        .forEach((el) => el.remove());

      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = href;
      document.head.appendChild(link);
    }

    // Mise à jour initiale
    updateFavicon();

    // Observer les changements de thème (class) et d'accent (style inline)
    const observer = new MutationObserver(() => {
      // requestAnimationFrame pour laisser le navigateur calculer les styles
      requestAnimationFrame(updateFavicon);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

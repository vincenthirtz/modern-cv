"use client";

import { useEffect } from "react";

/**
 * Easter egg pour les devs qui ouvrent la console.
 * Affiche un ASCII art + un message stylisé invitant au contact.
 * S'exécute une seule fois au mount.
 */
export default function ConsoleEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const banner = `
██╗   ██╗██╗███╗   ██╗ ██████╗███████╗███╗   ██╗████████╗
██║   ██║██║████╗  ██║██╔════╝██╔════╝████╗  ██║╚══██╔══╝
██║   ██║██║██╔██╗ ██║██║     █████╗  ██╔██╗ ██║   ██║
╚██╗ ██╔╝██║██║╚██╗██║██║     ██╔══╝  ██║╚██╗██║   ██║
 ╚████╔╝ ██║██║ ╚████║╚██████╗███████╗██║ ╚████║   ██║
  ╚═══╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝
`;

    const accentColor =
      getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() ||
      "#c8ff00";
    const accent = `color:${accentColor};font-family:ui-monospace,monospace;`;
    const muted = "color:#a8a79f;font-family:ui-monospace,monospace;font-size:11px;";
    const bold = "color:#f0efe9;font-family:ui-monospace,monospace;font-weight:700;font-size:13px;";

    console.log(`%c${banner}`, accent);

    console.log("%cSalut, dev curieux·se 👋", bold);

    console.log(
      "%cTu lis le code source ? Cool, j'aime ça.\nSi tu cherches un Lead Dev Front-End, on peut en parler.",
      muted,
    );

    console.log(
      "%c→ hirtzvincent@free.fr\n→ https://github.com/vincenthirtz\n→ https://pulse-js.fr",
      accent,
    );

    console.log("%cPS: essaie ↑↑↓↓←→←→ B A pour un cheat code 😉", muted);
  }, []);

  return null;
}

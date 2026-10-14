"use client";

import { useEffect } from "react";

const ACCENT_COLORS: Record<string, { dark: string; light: string }> = {
  Lime: { dark: "#c8ff00", light: "#4a7a00" },
  Cyan: { dark: "#00e5ff", light: "#007a8a" },
  Rose: { dark: "#ff3c82", light: "#d42265" },
  Orange: { dark: "#ff8a00", light: "#b86200" },
  Violet: { dark: "#a78bfa", light: "#6d47d9" },
};

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

    const isLight = document.documentElement.classList.contains("light");
    const storedAccent = localStorage.getItem("accent") ?? "Lime";
    const palette = ACCENT_COLORS[storedAccent] ?? ACCENT_COLORS.Lime;
    const accentColor = isLight ? palette.light : palette.dark;

    const accent = `color:${accentColor};font-family:ui-monospace,monospace;`;
    const muted = `color:${isLight ? "#5a5a54" : "#a8a79f"};font-family:ui-monospace,monospace;font-size:11px;`;
    const bold = `color:${isLight ? "#0a0a0b" : "#f0efe9"};font-family:ui-monospace,monospace;font-weight:700;font-size:13px;`;

    console.log(`%c${banner}`, accent);

    console.log("%cSalut, dev curieux·se 👋", bold);

    console.log(
      "%cTu lis le code source ? Cool, j'aime ça.\nSi tu cherches un Lead Dev Full-Stack, on peut en parler.",
      muted,
    );

    console.log(
      "%c→ hirtzvincent@gmail.com\n→ https://github.com/vincenthirtz\n→ https://pulse-js.fr",
      accent,
    );

    console.log("%cPS: essaie ↑↑↓↓←→←→ B A pour un cheat code 😉", muted);
  }, []);

  return null;
}

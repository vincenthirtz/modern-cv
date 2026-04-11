"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "À propos" },
  { href: "#expertise", label: "Expertise" },
  { href: "#projects", label: "Projets" },
  { href: "#experience", label: "Expérience" },
  { href: "#community", label: "Communauté" },
  { href: "#blog", label: "Notes" },
  { href: "#contact", label: "Contact" },
  { href: "/cv", label: "CV en ligne" },
  { href: "/branding", label: "Branding" },
];

export default function Footer() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }).format(now);
      setTime(formatted);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t px-6 py-12" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Left : logo + tagline */}
          <div>
            <a href="#top" className="font-mono text-xl font-bold">
              VH<span className="text-[var(--color-accent)]">.</span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-[var(--fg-muted)]">
              Vincent Hirtz — Lead Developer Front-End, basé à Lyon, disponible en remote ou sur
              site.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                Lyon, France
              </span>
              <span className="font-mono text-[10px] text-[var(--color-accent)]">— {time}</span>
            </div>
          </div>

          {/* Center : nav */}
          <nav>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-2 md:grid-cols-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right : back to top */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <a
              href="#top"
              className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              Retour en haut
              <span className="inline-block transition-transform group-hover:-translate-y-0.5">
                ↑
              </span>
            </a>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
              Tip : essayez ↑↑↓↓←→←→ B A
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-[var(--fg-dim)] md:flex-row md:items-center"
          style={{ borderColor: "var(--border)" }}
        >
          <div>© 2026 Vincent Hirtz. Tous droits réservés.</div>
          <div>
            Fait avec <span className="text-[var(--color-accent)]">♥</span> et beaucoup de café.
          </div>
        </div>
      </div>
    </footer>
  );
}

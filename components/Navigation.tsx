"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import EffectsToggle from "./EffectsToggle";
import AccentPicker from "./AccentPicker";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import type { NavLink } from "./DesktopNav";

const LINKS: NavLink[] = [
  { href: "/projects", label: "Projets" },
  { href: "/experience", label: "Expérience" },
  { href: "/community", label: "Communauté" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

/** Seuil en pixels avant de considérer la page comme scrollée */
const SCROLL_THRESHOLD = 40;
/** Padding max du header (en haut de page) */
const PADDING_MAX = 20;
/** Padding min du header (après scroll) */
const PADDING_MIN = 12;
/** Plage de scroll sur laquelle le padding s'interpole */
const PADDING_SCROLL_RANGE = 200;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [padding, setPadding] = useState(PADDING_MAX);
  const [entered, setEntered] = useState(false);

  const burgerRef = useRef<HTMLButtonElement>(null);

  // Scroll handler throttlé via requestAnimationFrame
  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      setScrolled(y > SCROLL_THRESHOLD);
      const delta = (PADDING_MAX - PADDING_MIN) * (y / PADDING_SCROLL_RANGE);
      setPadding(Math.max(PADDING_MIN, PADDING_MAX - delta));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Animation d'entrée via CSS
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8"
      style={{
        paddingTop: padding,
        paddingBottom: padding,
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-80px)",
        transition:
          "opacity 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.2s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.2s, padding 0.15s ease",
      }}
    >
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 sm:px-6 py-3 transition-all"
        style={{
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          background: scrolled
            ? "color-mix(in oklab, var(--bg) 70%, transparent)"
            : "color-mix(in oklab, var(--bg) 30%, transparent)",
          borderColor: scrolled ? "var(--border-strong)" : "var(--border)",
          boxShadow: scrolled ? "0 20px 60px -30px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Logo — lien vers l'accueil */}
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tighter"
          aria-label="Accueil"
        >
          VH<span className="text-[var(--color-accent)]">.</span>
        </Link>

        {/* Liens — desktop */}
        <DesktopNav links={LINKS} />

        {/* Disponible + toggles + burger */}
        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border px-3 py-1.5 lg:flex"
            style={{ borderColor: "var(--border-strong)" }}
            aria-hidden="true"
          >
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-green-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
              Disponible pour missions
            </span>
          </div>

          <div
            role="group"
            aria-label="Préférences d'affichage"
            className="flex items-center gap-3"
          >
            <EffectsToggle />
            <AccentPicker />
            <ThemeToggle />
          </div>

          {/* Burger mobile — animé en X à l'ouverture */}
          <button
            ref={burgerRef}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--border-strong)" }}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            <span className="flex w-4 flex-col items-center justify-center gap-1">
              <span
                className="block h-[1.5px] w-4 bg-current transition-transform duration-200"
                style={{
                  transform: open ? "translateY(2.5px) rotate(45deg)" : "translateY(0) rotate(0)",
                }}
              />
              <span
                className="block h-[1.5px] w-4 bg-current transition-transform duration-200"
                style={{
                  transform: open ? "translateY(-2.5px) rotate(-45deg)" : "translateY(0) rotate(0)",
                }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Menu mobile déroulé avec focus trap */}
      <MobileMenu links={LINKS} open={open} setOpen={setOpen} burgerRef={burgerRef} />
    </header>
  );
}

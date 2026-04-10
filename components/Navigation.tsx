"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import EffectsToggle from "./EffectsToggle";
import AccentPicker from "./AccentPicker";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import type { NavLink } from "./DesktopNav";

const LINKS: NavLink[] = [
  { href: "#about", label: "À propos", id: "about" },
  { href: "#expertise", label: "Expertise", id: "expertise" },
  { href: "#projects", label: "Projets", id: "projects" },
  { href: "#experience", label: "Expérience", id: "experience" },
  { href: "#community", label: "Communauté", id: "community" },
  { href: "#blog", label: "Notes", id: "blog" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [padding, setPadding] = useState(20);
  const [entered, setEntered] = useState(false);

  const burgerRef = useRef<HTMLButtonElement>(null);

  // Scroll handler : détecte le scroll et ajuste le padding
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Interpolation linéaire du padding : 20px → 12px entre 0 et 200px de scroll
      setPadding(Math.max(12, 20 - (y / 200) * 8));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animation d'entrée via CSS (remplace motion.header initial/animate)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Indicateur de section active basé sur IntersectionObserver
  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
        {/* Logo */}
        <a
          href="#top"
          className="font-mono text-lg font-bold tracking-tighter"
          aria-label="Retour en haut"
        >
          VH<span className="text-[var(--color-accent)]">.</span>
        </a>

        {/* Liens — desktop */}
        <DesktopNav links={LINKS} activeId={activeId} />

        {/* Disponible + toggles + burger */}
        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border px-3 py-1.5 lg:flex"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-green-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
              Disponible pour missions
            </span>
          </div>
          <EffectsToggle />
          <AccentPicker />
          <ThemeToggle />

          {/* Burger mobile */}
          <button
            ref={burgerRef}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--border-strong)" }}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-[1.5px] w-4 bg-current" />
              <span className="block h-[1.5px] w-4 bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {/* Menu mobile déroulé avec focus trap */}
      <MobileMenu links={LINKS} open={open} setOpen={setOpen} burgerRef={burgerRef} />
    </header>
  );
}

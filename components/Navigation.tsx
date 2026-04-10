"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import EffectsToggle from "./EffectsToggle";
import AccentPicker from "./AccentPicker";

const LINKS = [
  { href: "#about", label: "À propos", id: "about" },
  { href: "#expertise", label: "Expertise", id: "expertise" },
  { href: "#projects", label: "Projets", id: "projects" },
  { href: "#experience", label: "Expérience", id: "experience" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const { scrollY } = useScroll();
  const padding = useTransform(scrollY, [0, 200], [20, 12]);

  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Focus trap : verrouille Tab/Shift+Tab à l'intérieur du menu mobile
  const handleMenuKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open || !mobileMenuRef.current) return;

      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [open],
  );

  // Attacher / détacher le focus trap
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleMenuKeyDown);
      // Focus le premier lien à l'ouverture
      const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    } else {
      document.removeEventListener("keydown", handleMenuKeyDown);
    }
    return () => document.removeEventListener("keydown", handleMenuKeyDown);
  }, [open, handleMenuKeyDown]);

  // Fermer le menu mobile au scroll pour éviter un état incohérent
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indicateur de section active basé sur IntersectionObserver.
  // rootMargin négatif en haut pour considérer "active" une section quand
  // elle a passé la barre de nav.
  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Garde l'entrée la plus visible parmi celles intersectées
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
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8"
      style={{ paddingTop: padding, paddingBottom: padding }}
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
        <ul className="relative hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? "" : "hover-accent"
                  }`}
                  style={{
                    color: isActive
                      ? "var(--color-accent-contrast)"
                      : undefined,
                  }}
                >
                  {link.label}
                </a>
                {/* Pilule active animée — layoutId partage l'élément entre liens */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    aria-hidden
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-0 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Disponible + theme toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border px-3 py-1.5 lg:flex" style={{ borderColor: "var(--border-strong)" }}>
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
      <AnimatePresence>
        {open && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-nav-menu"
            role="dialog"
            aria-label="Menu de navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border p-4 md:hidden"
            style={{
              background: "var(--elevated)",
              borderColor: "var(--border-strong)",
            }}
          >
            <ul className="flex flex-col gap-1" role="list">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => {
                      setOpen(false);
                      burgerRef.current?.focus();
                    }}
                    className="block rounded-xl px-4 py-3 text-sm hover:bg-[var(--bg)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

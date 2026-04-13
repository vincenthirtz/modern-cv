"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import EffectsToggle from "./EffectsToggle";
import AccentPicker from "./AccentPicker";

interface DockItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const DOCK_ITEMS: DockItem[] = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 10v9a1 1 0 001 1h3.5v-5a1.5 1.5 0 013 0v5H16a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projets",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    href: "/experience",
    label: "Expérience",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="12.01" />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Communauté",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/notes",
    label: "Notes",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

/** Scale max au survol */
const SCALE_MAX = 1.45;
/** Scale min (items éloignés) */
const SCALE_MIN = 1;

/** Calcule le scale d'un item en fonction de sa distance à l'item survolé */
function getItemScale(index: number, hovered: number | null): number {
  if (hovered === null) return SCALE_MIN;
  const distance = Math.abs(index - hovered);
  if (distance >= 2) return SCALE_MIN;
  // distance 0 → max, 1 → midpoint, 2+ → min
  const ratio = 1 - distance / 2;
  return SCALE_MIN + (SCALE_MAX - SCALE_MIN) * ratio * ratio;
}

export default function Navigation() {
  const pathname = usePathname();
  const [entered, setEntered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animation d'entrée
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll handler pour la top bar
  useEffect(() => {
    let ticking = false;
    let rafId = 0;

    function update() {
      setScrolled(window.scrollY > 40);
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

  const handleDockMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <>
      {/* ─── Top bar macOS ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(-40px)",
          transition:
            "opacity 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.1s, transform 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.1s",
        }}
      >
        <nav
          aria-label="Barre de menu"
          className="flex items-center justify-between px-5 py-2.5 sm:px-8"
          style={{
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            background: scrolled
              ? "color-mix(in oklab, var(--bg) 80%, transparent)"
              : "color-mix(in oklab, var(--bg) 40%, transparent)",
            borderBottom: `1px solid ${scrolled ? "var(--border-strong)" : "var(--border)"}`,
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-lg font-bold tracking-tighter"
            aria-label="Accueil"
          >
            VH<span className="text-[var(--color-accent)]">.</span>
          </Link>

          {/* Droite : disponibilité + toggles */}
          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2 rounded-full border px-3 py-1 sm:flex"
              style={{ borderColor: "var(--border-strong)" }}
              aria-hidden="true"
            >
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">
                Disponible
              </span>
            </div>

            <div
              role="group"
              aria-label="Préférences d'affichage"
              className="flex items-center gap-2"
            >
              <EffectsToggle />
              <AccentPicker />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* ─── Dock macOS (bottom) ─── */}
      <nav
        aria-label="Navigation principale"
        className="dock-container fixed bottom-4 left-1/2 z-50 sm:bottom-6"
        onMouseLeave={handleDockMouseLeave}
        style={{
          opacity: entered ? 1 : 0,
          transform: entered
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(60px)",
          transition:
            "opacity 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.3s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.3s",
        }}
      >
        <div
          className="dock-bar flex items-end gap-1.5 rounded-2xl border px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5"
          style={{
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            background: "color-mix(in oklab, var(--bg) 65%, transparent)",
            borderColor: "var(--border-strong)",
            boxShadow:
              "0 8px 32px -8px rgba(0,0,0,0.5), 0 0 0 0.5px var(--border), inset 0 1px 0 0 rgba(255,255,255,0.05)",
          }}
        >
          {DOCK_ITEMS.map((item, index) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const scale = getItemScale(index, hoveredIndex);

            return (
              <div
                key={item.href}
                data-dock-item
                className="dock-item-wrapper relative flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <span
                  className="dock-tooltip pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] tracking-wide"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border-strong)",
                    color: "var(--fg)",
                    opacity: hoveredIndex === index ? 1 : 0,
                    transform: hoveredIndex === index ? "translateY(0)" : "translateY(4px)",
                    transition: "opacity 0.15s, transform 0.15s",
                  }}
                  aria-hidden="true"
                >
                  {item.label}
                </span>

                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="dock-icon flex items-center justify-center rounded-xl transition-colors"
                  style={{
                    width: 44,
                    height: 44,
                    transform: `scale(${scale})`,
                    transformOrigin: "bottom center",
                    transition:
                      hoveredIndex !== null
                        ? "transform 0.15s cubic-bezier(0.2,0.8,0.2,1)"
                        : "transform 0.3s cubic-bezier(0.2,0.8,0.2,1)",
                    background: isActive
                      ? "var(--color-accent)"
                      : "color-mix(in oklab, var(--fg) 8%, transparent)",
                    color: isActive ? "var(--color-accent-contrast)" : "var(--fg-muted)",
                  }}
                >
                  <span className="h-5 w-5 sm:h-[22px] sm:w-[22px]">{item.icon}</span>
                </Link>

                {/* Indicateur actif (point) */}
                <span
                  className="mt-1 h-1 w-1 rounded-full transition-opacity"
                  style={{
                    background: "var(--color-accent)",
                    opacity: isActive ? 1 : 0,
                  }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}

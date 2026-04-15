"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccentPicker from "../AccentPicker";
import EffectsToggle from "../EffectsToggle";
import ThemeToggle from "../ThemeToggle";
import { useScrolled } from "@/hooks/useScrolled";

interface Props {
  entered: boolean;
  dockVisible: boolean;
  onToggleDock: () => void;
}

/**
 * Barre supérieure type macOS : logo, indicateur de disponibilité,
 * toggles thème/accent/effets, masquage du dock.
 */
export default function TopBar({ entered, dockVisible, onToggleDock }: Props) {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
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
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tighter"
          aria-label="Accueil"
          aria-current={isHome ? "page" : undefined}
        >
          VH<span className="text-[var(--color-accent)]">.</span>
        </Link>

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
            <button
              type="button"
              onClick={onToggleDock}
              aria-label={dockVisible ? "Masquer le dock" : "Afficher le dock"}
              title={dockVisible ? "Masquer le dock" : "Afficher le dock"}
              className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                borderColor: "var(--border-strong)",
                color: dockVisible ? "var(--fg)" : "var(--fg-dim)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="14" x2="18" y2="14" />
                <line x1="8" y1="14" x2="8" y2="18" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="16" y1="14" x2="16" y2="18" />
              </svg>
            </button>
            <EffectsToggle />
            <AccentPicker />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

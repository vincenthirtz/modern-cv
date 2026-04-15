"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { getItemScale } from "@/lib/navigation-data";

interface Props {
  href: string;
  label: string;
  icon: ReactNode;
  index: number;
  hoveredIndex: number | null;
  isActive: boolean;
  onHover: (index: number | null) => void;
}

/**
 * Item individuel du dock : icône scalée selon la distance au curseur
 * (effet macOS), tooltip au survol, indicateur "page active".
 */
export default function DockItem({
  href,
  label,
  icon,
  index,
  hoveredIndex,
  isActive,
  onHover,
}: Props) {
  const scale = getItemScale(index, hoveredIndex);
  const isHovered = hoveredIndex === index;

  return (
    <div
      data-dock-item
      className="dock-item-wrapper relative flex flex-col items-center"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <span
        className="dock-tooltip pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] tracking-wide"
        style={{
          background: "var(--elevated)",
          borderColor: "var(--border-strong)",
          color: "var(--fg)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.15s, transform 0.15s",
        }}
        aria-hidden="true"
      >
        {label}
      </span>

      <Link
        href={href}
        aria-label={label}
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
        <span className="h-5 w-5 sm:h-[22px] sm:w-[22px]">{icon}</span>
      </Link>

      <span
        className="mt-1 h-1 w-1 rounded-full transition-opacity"
        style={{ background: "var(--color-accent)", opacity: isActive ? 1 : 0 }}
        aria-hidden="true"
      />
    </div>
  );
}

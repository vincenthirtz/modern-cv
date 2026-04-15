"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import DockItem from "./DockItem";
import { DOCK_ITEMS } from "@/lib/navigation-data";

interface Props {
  entered: boolean;
  visible: boolean;
}

/**
 * Dock macOS (bas de page) : navigation principale avec effet d'agrandissement
 * au survol qui cascade sur les voisins.
 */
export default function Dock({ entered, visible }: Props) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <nav
      aria-label="Navigation principale"
      aria-hidden={!visible}
      // @ts-expect-error : `inert` est un attribut HTML standard mais pas encore typé par React 19
      inert={!visible ? "" : undefined}
      className="dock-container fixed bottom-4 left-1/2 z-50 sm:bottom-6"
      onMouseLeave={handleLeave}
      style={{
        opacity: entered && visible ? 1 : 0,
        transform:
          entered && visible
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(60px)",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 0.4s cubic-bezier(0.2,0.8,0.2,1), transform 0.4s cubic-bezier(0.2,0.8,0.2,1)",
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
            "0 8px 32px -8px var(--dock-shadow, rgba(0,0,0,0.5)), 0 0 0 0.5px var(--border), inset 0 1px 0 0 rgba(255,255,255,0.05)",
        }}
      >
        {DOCK_ITEMS.map((item, index) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <DockItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              index={index}
              hoveredIndex={hoveredIndex}
              isActive={isActive}
              onHover={setHoveredIndex}
            />
          );
        })}
      </div>
    </nav>
  );
}

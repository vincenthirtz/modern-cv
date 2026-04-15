import type { ReactNode } from "react";

export interface DockItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const SVG_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Items du dock macOS — ordre = ordre d'affichage (gauche → droite).
 * Les SVG sont inlinés pour éviter une requête supplémentaire et
 * tirer parti du tree-shaking React.
 */
export const DOCK_ITEMS: DockItem[] = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <svg {...SVG_PROPS}>
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 10v9a1 1 0 001 1h3.5v-5a1.5 1.5 0 013 0v5H16a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projets",
    icon: (
      <svg {...SVG_PROPS}>
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
      <svg {...SVG_PROPS}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="12.01" />
      </svg>
    ),
  },
  {
    href: "/job-ideal",
    label: "Job idéal",
    icon: (
      <svg {...SVG_PROPS}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Communauté",
    icon: (
      <svg {...SVG_PROPS}>
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
      <svg {...SVG_PROPS}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg {...SVG_PROPS}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

const SCALE_MAX = 1.45;
const SCALE_MIN = 1;

/** Calcule le scale d'un item en fonction de sa distance à l'item survolé. */
export function getItemScale(index: number, hovered: number | null): number {
  if (hovered === null) return SCALE_MIN;
  const distance = Math.abs(index - hovered);
  if (distance >= 2) return SCALE_MIN;
  const ratio = 1 - distance / 2;
  return SCALE_MIN + (SCALE_MAX - SCALE_MIN) * ratio * ratio;
}

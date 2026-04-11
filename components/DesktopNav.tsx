"use client";

import Link from "next/link";
import { motion } from "motion/react";

export interface NavLink {
  href: string;
  label: string;
  id: string;
}

interface DesktopNavProps {
  links: NavLink[];
  activeId: string;
}

export default function DesktopNav({ links, activeId }: DesktopNavProps) {
  const isPage = (href: string) => href.startsWith("/");

  return (
    <ul className="relative hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const isActive = link.id !== "" && activeId === link.id;
        const className = `relative z-10 rounded-full px-4 py-2 text-sm transition-colors ${
          isActive ? "" : "hover-accent"
        }`;
        const style = { color: isActive ? "var(--color-accent-contrast)" : undefined };

        return (
          <li key={link.href} className="relative">
            {isPage(link.href) ? (
              <Link href={link.href} className={className} style={style}>
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={className}
                style={style}
              >
                {link.label}
              </a>
            )}
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
  );
}

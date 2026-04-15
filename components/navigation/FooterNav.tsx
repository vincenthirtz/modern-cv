"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/projects", label: "Projets" },
  { href: "/experience", label: "Expérience" },
  { href: "/community", label: "Communauté" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
  { href: "/cv", label: "CV en ligne" },
  { href: "/branding", label: "Branding" },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation du pied de page">
      <ul className="grid grid-cols-2 gap-x-12 gap-y-2 md:grid-cols-1">
        {NAV_LINKS.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--color-accent)] aria-[current=page]:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

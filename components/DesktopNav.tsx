"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
  href: string;
  label: string;
  id: string;
}

interface DesktopNavProps {
  links: NavLink[];
  activeId: string;
}

export default function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <ul className="relative hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative z-10 rounded-full px-4 py-2 text-sm transition-colors ${
                isActive ? "" : "hover-accent"
              }`}
              style={{ color: isActive ? "var(--color-accent-contrast)" : undefined }}
            >
              {link.label}
            </Link>
            {isActive && (
              <span
                aria-hidden
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

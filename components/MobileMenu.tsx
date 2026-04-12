"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./DesktopNav";

interface MobileMenuProps {
  links: NavLink[];
  open: boolean;
  setOpen: (open: boolean) => void;
  burgerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({ links, open, setOpen, burgerRef }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fermer le menu au changement de route (back/forward navigateur)
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Scroll lock quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap : verrouille Tab/Shift+Tab à l'intérieur du menu mobile
  const handleMenuKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open || !menuRef.current) return;

      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
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
    [open, setOpen, burgerRef],
  );

  // Attacher / détacher le focus trap
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleMenuKeyDown);
      const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    } else {
      document.removeEventListener("keydown", handleMenuKeyDown);
    }
    return () => document.removeEventListener("keydown", handleMenuKeyDown);
  }, [open, handleMenuKeyDown]);

  // Fermer le menu mobile au scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [open, setOpen]);

  return (
    <div
      ref={menuRef}
      id="mobile-nav-menu"
      role="dialog"
      aria-label="Menu de navigation"
      aria-hidden={!open}
      className="mx-auto mt-2 max-w-6xl rounded-2xl border p-4 md:hidden"
      style={{
        background: "var(--elevated)",
        borderColor: "var(--border-strong)",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.2s ease, transform 0.2s ease, visibility 0.2s",
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
      }}
    >
      <ul className="flex flex-col gap-1" role="list">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                tabIndex={open ? 0 : -1}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  burgerRef.current?.focus();
                }}
                className="block rounded-xl px-4 py-3 text-sm transition-colors"
                style={{
                  background: isActive ? "var(--color-accent)" : undefined,
                  color: isActive ? "var(--color-accent-contrast)" : undefined,
                }}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { NavLink } from "./DesktopNav";

interface MobileMenuProps {
  links: NavLink[];
  open: boolean;
  setOpen: (open: boolean) => void;
  burgerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({ links, open, setOpen, burgerRef }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
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
            {links.map((link) => (
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
  );
}

"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  as?: "a" | "button";
  type?: "button" | "submit";
  download?: boolean | string;
  target?: "_blank" | "_self";
  ariaLabel?: string;
}

/**
 * Bouton ou lien avec un effet magnétique au hover.
 * Le contenu suit légèrement le curseur quand il est dans la zone.
 */
export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.35,
  as,
  type = "button",
  download,
  target,
  ariaLabel,
}: MagneticButtonProps) {
  // Un ref générique HTMLElement nullable suffit — on n'utilise que getBoundingClientRect.
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const useAnchor = (as ?? (href ? "a" : "button")) === "a";

  function handleMove(e: MouseEvent) {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = useAnchor ? anchorRef.current : buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const inner = (
    <motion.span style={{ x: sx, y: sy }} className="inline-flex items-center gap-2">
      {children}
    </motion.span>
  );

  if (useAnchor) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        download={download}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        style={{ x: sx, y: sy }}
        className={className}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {inner}
    </motion.button>
  );
}

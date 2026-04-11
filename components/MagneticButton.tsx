"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const useAnchor = (as ?? (href ? "a" : "button")) === "a";

  function handleMove(e: MouseEvent) {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = useAnchor ? anchorRef.current : buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setOffset({ x: offsetX, y: offsetY });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const transformStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  const inner = (
    <span style={transformStyle} className="inline-flex items-center gap-2">
      {children}
    </span>
  );

  if (useAnchor) {
    return (
      <a
        ref={anchorRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        download={download}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        style={transformStyle}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      style={transformStyle}
      className={className}
    >
      {inner}
    </button>
  );
}

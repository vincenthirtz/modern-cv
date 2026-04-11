"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import AnimatedText from "./AnimatedText";

interface SectionTitleProps {
  number: string;
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  /** Affiche le numéro géant en background, parallaxé. true par défaut. */
  bigNumber?: boolean;
}

/**
 * Titre de section réutilisable avec :
 * - une numérotation type "01 — Section"
 * - un numéro géant en background, en outline serif, parallaxé au scroll
 * - un titre animé mot par mot
 * - une description optionnelle
 */
export default function SectionTitle({
  number,
  label,
  title,
  highlight,
  description,
  bigNumber = true,
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bigNumRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const descInView = useInView(descRef, { once: true });

  // Scroll-linked parallax pour le numéro géant
  useEffect(() => {
    if (!bigNumber) return;
    function onScroll() {
      if (!ref.current || !bigNumRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      const current = vh - rect.top;
      const progress = Math.max(0, Math.min(1, current / total));
      // y: 80 → -80
      const y = 80 - progress * 160;
      // opacity: 0→0.6→0.6→0 aux stops [0, 0.3, 0.7, 1]
      let opacity: number;
      if (progress < 0.3) opacity = (progress / 0.3) * 0.6;
      else if (progress < 0.7) opacity = 0.6;
      else opacity = 0.6 * (1 - (progress - 0.7) / 0.3);
      bigNumRef.current.style.transform = `translateY(${y}px)`;
      bigNumRef.current.style.opacity = String(opacity);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bigNumber]);

  return (
    <div ref={ref} className="relative mb-16 max-w-3xl">
      {/* Numéro géant en background — outline serif, parallaxé */}
      {bigNumber && (
        <div
          ref={bigNumRef}
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-8 select-none font-serif leading-none md:-right-16 lg:-right-32"
          style={{ opacity: 0 }}
        >
          <span
            className="block text-[clamp(10rem,22vw,22rem)] font-normal"
            style={{
              WebkitTextStroke: "1px var(--color-accent)",
              color: "transparent",
              textShadow: "none",
            }}
          >
            {number}
          </span>
        </div>
      )}

      {/* En-tête classique */}
      <div
        ref={headerRef}
        className="relative z-10 mb-6 flex items-center gap-3"
        style={{
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <span className="font-mono text-xs text-[var(--color-accent)]">{number}</span>
        <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          {label}
        </span>
      </div>
      <div className="relative z-10">
        <AnimatedText
          el="h2"
          text={title}
          highlight={highlight}
          className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tight"
          splitBy="word"
        />
      </div>
      {description && (
        <p
          ref={descRef}
          className="relative z-10 mt-6 max-w-2xl text-lg text-[var(--fg-muted)]"
          style={{
            opacity: descInView ? 1 : 0,
            transform: descInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

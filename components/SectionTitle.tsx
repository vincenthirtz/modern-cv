"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax : le numéro géant se déplace plus lentement que le contenu
  const numberY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);

  return (
    <div ref={ref} className="relative mb-16 max-w-3xl">
      {/* Numéro géant en background — outline serif, parallaxé */}
      {bigNumber && (
        <motion.div
          aria-hidden
          style={{ y: numberY, opacity: numberOpacity }}
          className="pointer-events-none absolute -top-32 -right-8 select-none font-serif leading-none md:-right-16 lg:-right-32"
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
        </motion.div>
      )}

      {/* En-tête classique */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6 flex items-center gap-3"
      >
        <span className="font-mono text-xs text-[var(--color-accent)]">{number}</span>
        <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          {label}
        </span>
      </motion.div>
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 mt-6 max-w-2xl text-lg text-[var(--fg-muted)]"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

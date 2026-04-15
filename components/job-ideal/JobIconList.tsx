"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import type { IconLabel } from "@/lib/job-ideal-data";

interface Props {
  title: string;
  symbol: string;
  /** Couleur du symbole : "accent" (vert) ou "red" (rouge) */
  tone: "accent" | "red";
  items: IconLabel[];
  delay?: number;
}

/** Liste à puces stylisée — utilisée pour Dealbreakers et Bonus. */
export default function JobIconList({ title, symbol, tone, items, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const colorVar = tone === "accent" ? "var(--color-accent)" : "rgb(248 113 113)";
  const lineColor = tone === "accent" ? "bg-[var(--color-accent)]/40" : "bg-red-400/40";
  const symbolClass = tone === "accent" ? "text-[var(--color-accent)]" : "text-red-400";

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <h3 className="mb-6 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
        <span className={symbolClass}>{symbol}</span>
        <span className={`block h-[1px] w-6 ${lineColor}`} />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm"
            style={{
              borderColor: "var(--border)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-10px)",
              transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
            }}
          >
            <span style={{ color: colorVar }} aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

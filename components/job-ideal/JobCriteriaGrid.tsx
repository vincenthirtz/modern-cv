"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { CRITERIA } from "@/lib/job-ideal-data";

/** Grille des 6 critères principaux. */
export default function JobCriteriaGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {CRITERIA.map((item, i) => (
        <article
          key={item.title}
          className="group rounded-2xl border p-6 transition-colors hover:border-[var(--color-accent)]"
          style={{
            borderColor: "var(--border-strong)",
            background: "color-mix(in oklab, var(--elevated) 50%, transparent)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, border-color 0.3s`,
          }}
        >
          <span
            aria-hidden
            className="mb-4 block text-2xl text-[var(--color-accent)] transition-transform group-hover:rotate-12"
          >
            {item.icon}
          </span>
          <h3 className="mb-2 font-serif text-xl leading-tight">{item.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

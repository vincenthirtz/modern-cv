"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { HYBRID_SKILLS } from "@/lib/job-ideal-data";

/**
 * Bande de tags des compétences hybrides (dev + design).
 * Apparition au scroll avec stagger.
 */
export default function JobSkillsTags() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="mt-10 flex flex-wrap gap-2"
      aria-label="Compétences hybrides dev et design"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {HYBRID_SKILLS.map((skill, i) => (
        <span
          key={skill}
          className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in oklab, var(--elevated) 40%, transparent)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s, border-color 0.3s, color 0.3s`,
          }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

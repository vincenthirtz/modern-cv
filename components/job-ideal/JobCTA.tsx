"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

/** CTA final de la page Job idéal : contact + CV. */
export default function JobCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="mt-24 rounded-2xl border p-8 text-center md:p-12"
      style={{
        borderColor: "var(--border-strong)",
        background: "color-mix(in oklab, var(--elevated) 30%, transparent)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <p className="mx-auto max-w-xl font-serif text-2xl leading-snug md:text-3xl">
        Ça ressemble à votre boîte ? <span className="text-[var(--color-accent)]">Parlons-en.</span>
      </p>
      <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--fg-muted)]">
        Je suis ouvert aux opportunités qui cochent la majorité de ces cases. Pas besoin de tout
        cocher — le feeling humain compte autant que la stack.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="/contact"
          className="rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-contrast)" }}
        >
          Me contacter
        </a>
        <a
          href="/cv"
          className="rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          style={{ borderColor: "var(--border-strong)" }}
        >
          Voir mon CV
        </a>
      </div>
    </div>
  );
}

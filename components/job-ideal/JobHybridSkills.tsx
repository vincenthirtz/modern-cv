"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { UI_SKILLS, UX_SKILLS, type HybridSkill } from "@/lib/job-ideal-data";

interface PanelProps {
  inView: boolean;
  side: "left" | "right";
  title: string;
  subtitle: string;
  items: HybridSkill[];
}

function SkillPanel({ inView, side, title, subtitle, items }: PanelProps) {
  return (
    <div
      className="rounded-2xl border p-6 md:p-8"
      style={{
        borderColor: "var(--border-strong)",
        background: "color-mix(in oklab, var(--elevated) 40%, transparent)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${side === "left" ? "-20px" : "20px"})`,
        transition: `opacity 0.6s ease ${side === "left" ? "0.1s" : "0.2s"}, transform 0.6s ease ${side === "left" ? "0.1s" : "0.2s"}`,
      }}
    >
      <h4 className="mb-6 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
        <span>{title}</span>
        <span className="block h-[1px] w-8 bg-[var(--color-accent)]/40" />
        <span className="text-[var(--fg-muted)]">{subtitle}</span>
      </h4>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.title}>
            <h5 className="mb-1 font-serif text-lg leading-tight">{item.title}</h5>
            <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Section "double casquette" UI / UX. */
export default function JobHybridSkills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="mt-24">
      <div
        className="mb-10 flex flex-col gap-3"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <span className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          <span className="text-[var(--color-accent)]">✦</span>
          <span className="block h-[1px] w-6 bg-[var(--color-accent)]/40" />
          Ma double casquette
        </span>
        <h3 className="font-serif text-3xl leading-tight md:text-4xl">
          Dev qui pense <span className="text-[var(--color-accent)]">design</span>.
        </h3>
        <p className="max-w-2xl text-[var(--fg-muted)]">
          Un Lead front n&apos;est pas qu&apos;un architecte technique. Je porte aussi une
          sensibilité UI &amp; UX forte — parce qu&apos;un produit réussi se joue autant dans
          l&apos;expérience que dans le code.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <SkillPanel
          inView={inView}
          side="left"
          title="UI"
          subtitle="Interface & Systems"
          items={UI_SKILLS}
        />
        <SkillPanel
          inView={inView}
          side="right"
          title="UX"
          subtitle="Parcours & Usage"
          items={UX_SKILLS}
        />
      </div>
    </div>
  );
}

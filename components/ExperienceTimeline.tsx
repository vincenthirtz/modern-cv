"use client";

import { motion } from "framer-motion";

interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
}

interface ExperienceTimelineProps {
  jobs: Job[];
}

export default function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      {/* Ligne verticale de la timeline */}
      <div
        aria-hidden
        className="absolute left-4 top-0 bottom-0 w-[1px] md:left-1/2 md:-translate-x-1/2"
        style={{ background: "var(--border-strong)" }}
      />
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-4 top-0 h-full w-[1px] origin-top md:left-1/2 md:-translate-x-1/2"
        style={{ background: "var(--color-accent)", opacity: 0.5 }}
      />

      <div className="space-y-12">
        {jobs.map((job, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className={`relative grid grid-cols-[2rem_1fr] gap-4 md:grid-cols-2 md:gap-12 ${
                isLeft ? "" : "md:[&>*:last-child]:order-1"
              }`}
            >
              {/* Dot sur la ligne */}
              <div className="relative md:col-span-2 md:absolute md:left-1/2 md:top-8 md:-translate-x-1/2">
                <div className="absolute left-4 -translate-x-1/2 md:static md:translate-x-0">
                  <div className="relative h-4 w-4 rounded-full border-2 border-[var(--bg)] bg-[var(--color-accent)]">
                    <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-30 blur-md" />
                  </div>
                </div>
              </div>

              {/* Spacer pour la timeline alternée desktop */}
              <div className={`hidden md:block ${isLeft ? "" : "md:order-2"}`} />

              {/* Carte */}
              <div className={`card p-6 md:p-7 ${isLeft ? "md:text-right" : ""}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                  {job.period}
                </div>
                <h3 className="mt-2 font-serif text-3xl">{job.role}</h3>
                <div className="text-sm text-[var(--fg-muted)]">@ {job.company}</div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {job.description}
                </p>
                <div className={`mt-4 flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : ""}`}>
                  {job.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] text-[var(--fg-muted)]"
                      style={{ borderColor: "var(--border-strong)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

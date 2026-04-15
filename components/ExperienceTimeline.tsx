"use client";

import useInViewCSS from "./useInViewCSS";

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

function TimelineItem({ job, index }: { job: Job; index: number }) {
  const isLeft = index % 2 === 0;
  const { ref, inView } = useInViewCSS({ amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`relative grid grid-cols-[2rem_1fr] gap-4 md:grid-cols-2 md:gap-12 ${
        isLeft ? "" : "md:[&>*:last-child]:order-1"
      } ${inView ? (isLeft ? "anim-fade-left" : "anim-fade-right") : ""}`}
      style={{
        opacity: inView ? undefined : 0,
      }}
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
        <div className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-accent)]">
          {job.period}
        </div>
        <h3 className="mt-2 font-serif text-3xl">{job.role}</h3>
        <div className="text-sm text-[var(--fg-muted)]">@ {job.company}</div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">{job.description}</p>
        <div className={`mt-4 flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : ""}`}>
          {job.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border px-2.5 py-1 font-mono text-[0.625rem] text-[var(--fg-muted)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  const { ref: lineRef, inView: lineInView } = useInViewCSS({ amount: 0.1 });

  return (
    <div className="relative">
      {/* Ligne verticale de la timeline — statique */}
      <div
        aria-hidden
        className="absolute left-4 top-0 bottom-0 w-[1px] md:left-1/2 md:-translate-x-1/2"
        style={{ background: "var(--border-strong)" }}
      />
      {/* Ligne accent animée */}
      <div
        ref={lineRef}
        aria-hidden
        className={lineInView ? "anim-scale-y" : ""}
        style={{
          position: "absolute",
          left: "1rem",
          top: 0,
          height: "100%",
          width: "1px",
          background: "var(--color-accent)",
          opacity: lineInView ? 0.5 : 0,
          transformOrigin: "top",
        }}
      />

      <div className="space-y-12">
        {jobs.map((job, i) => (
          <TimelineItem key={job.company} job={job} index={i} />
        ))}
      </div>
    </div>
  );
}

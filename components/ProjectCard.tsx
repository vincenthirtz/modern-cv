"use client";

import Image from "next/image";
import TiltCard from "./TiltCard";
import PulseSandbox from "./PulseSandbox";
import useInViewCSS from "./useInViewCSS";

interface Project {
  name: string;
  tagline: string;
  description: string;
  role: string;
  tags: string[];
  gradient: string;
  href: string;
  linkLabel?: string;
  image?: string;
  showSandbox?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  reversed: boolean;
}

export default function ProjectCard({ project, index, total, reversed }: ProjectCardProps) {
  const { ref, inView } = useInViewCSS({ amount: 0.2 });

  return (
    <div
      ref={ref}
      className={inView ? "anim-fade-up" : ""}
      style={{
        opacity: inView ? undefined : 0,
        animationDuration: "0.8s",
      }}
    >
      <TiltCard intensity={4} className="group">
        <article className="card relative overflow-hidden p-6 md:p-10">
          <div
            className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${
              reversed ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Visuel — sandbox interactif si Pulse JS, sinon image/gradient */}
            {project.showSandbox ? (
              <div style={{ transform: "translateZ(40px)" }}>
                <PulseSandbox />
              </div>
            ) : (
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-xl border"
                style={{
                  borderColor: "var(--border-strong)",
                  transform: "translateZ(40px)",
                }}
              >
                {/* Image projet si fournie, sinon gradient */}
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`Aperçu du projet ${project.name}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0" style={{ background: project.gradient }} />
                    <div className="absolute inset-0 bg-grid opacity-30" />
                  </>
                )}
                {/* Mock window chrome */}
                <div className="absolute left-4 top-4 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                </div>
                <div className="absolute right-4 bottom-4 font-mono text-[0.625rem] uppercase tracking-widest text-white/60">
                  {project.tags[0]}
                </div>
              </div>
            )}

            {/* Contenu */}
            <div style={{ transform: "translateZ(20px)" }}>
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-accent)]">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{project.name}</h3>
              <p className="mt-2 text-base text-[var(--fg-muted)]">{project.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-muted)] transition-colors group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="mt-6 flex items-center justify-between border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
                  {project.role}
                </span>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.linkLabel ?? "Voir le projet"} (nouvel onglet)`}
                  className="group/link inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-accent)]"
                >
                  {project.linkLabel ?? "Voir le projet"}
                  <span className="transition-transform group-hover/link:translate-x-1">↗</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </TiltCard>
    </div>
  );
}

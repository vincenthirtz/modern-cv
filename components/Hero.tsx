"use client";

import { useEffect, useRef } from "react";
import AnimatedText from "./AnimatedText";
import Counter from "./Counter";
import MagneticButton from "./MagneticButton";

const METRICS = [
  { value: 10, suffix: "+", label: "Années d'expérience" },
  { value: 3, suffix: "", label: "Frameworks maîtrisés" },
  { value: 1, suffix: "", label: "Framework JS open-source" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / h));

      if (blobRef.current) {
        blobRef.current.style.transform = `translateY(${progress * -150}px)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${progress * 200}px)`;
        contentRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.9));
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20 sm:pt-40"
    >
      {/* Grille graph paper en filigrane */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      {/* Halo aurora */}
      <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0" />

      {/* Formes flottantes en arrière-plan */}
      <div ref={blobRef} aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-[420px] w-[420px] rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-[360px] w-[360px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[100px]" />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Tagline */}
        <div
          className="mb-8 flex items-center gap-3"
          style={{ opacity: 0, animation: "fade-in-left 0.8s ease forwards 0.3s" }}
        >
          <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Lead Developer Front-End · Lyon
          </span>
        </div>

        {/* Titre principal */}
        <AnimatedText
          el="h1"
          className="font-serif text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight"
          text="Je construis des expériences digitales exceptionnelles"
          highlight="exceptionnelles"
          splitBy="word"
          staggerChildren={0.05}
          delay={0.4}
        />

        {/* Sous-titre */}
        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl"
          style={{ opacity: 0, animation: "fade-in-up 0.8s ease forwards 1.4s" }}
        >
          Lead Developer Front-End basé à Lyon. 10+ ans à concevoir des SPA complexes avec React,
          Vue et Angular — et à former les équipes qui les font vivre. Curiosité infinie, code
          soigné.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-wrap gap-4"
          style={{ opacity: 0, animation: "fade-in-up 0.8s ease forwards 1.6s" }}
        >
          <MagneticButton href="/projects" className="btn-accent">
            Voir mes projets
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </MagneticButton>
          <MagneticButton href="/contact" className="btn-ghost">
            Me contacter
          </MagneticButton>
          <MagneticButton href="/cv" className="btn-ghost">
            Voir le CV
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </MagneticButton>
          <MagneticButton
            href="/cv.pdf"
            download="Vincent-Hirtz-CV.pdf"
            ariaLabel="Télécharger le CV de Vincent Hirtz au format PDF"
            className="btn-ghost"
          >
            Télécharger le CV
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </MagneticButton>
        </div>

        {/* Métriques animées */}
        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className="border-l pl-4"
              style={{
                borderColor: "var(--border-strong)",
                opacity: 0,
                animation: `fade-in-up 0.7s ease forwards ${1.8 + i * 0.15}s`,
              }}
            >
              <div className="font-serif text-5xl text-[var(--color-accent)] md:text-6xl">
                <Counter to={metric.value} suffix={metric.suffix} />
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[var(--fg-muted)]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur scroll */}
      <div
        className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 sm:flex"
        style={{ opacity: 0, animation: "fade-in 1s ease forwards 2.2s" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
          Scroll
        </span>
        <span
          className="block h-[1px] w-16 origin-left bg-[var(--color-accent)]"
          style={{ animation: "scroll-line-pulse 2s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}

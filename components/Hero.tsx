"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import AnimatedText from "./AnimatedText";
import Counter from "./Counter";
import MagneticButton from "./MagneticButton";

const METRICS = [
  { value: 10, suffix: "+", label: "Années d'expérience" },
  { value: 3, suffix: "", label: "Frameworks maîtrisés" },
  { value: 1, suffix: "", label: "Framework JS open-source" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax subtil sur le contenu et les blobs
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20 sm:pt-40"
    >
      {/* Grille graph paper en filigrane */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      {/* Halo aurora */}
      <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0" />

      {/* Formes flottantes en arrière-plan */}
      <motion.div aria-hidden style={{ y: blobY }} className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-[420px] w-[420px] rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-[360px] w-[360px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[100px]" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Lead Developer Front-End · Lyon
          </span>
        </motion.div>

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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl"
        >
          Lead Developer Front-End basé à Lyon. 10+ ans à concevoir des SPA complexes avec React,
          Vue et Angular — et à former les équipes qui les font vivre. Curiosité infinie, code
          soigné.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href="#projects" className="btn-accent">
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
          <MagneticButton href="#contact" className="btn-ghost">
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
        </motion.div>

        {/* Métriques animées */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 1.8 } },
          }}
          className="mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {METRICS.map((metric) => (
            <motion.div
              key={metric.label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
              }}
              className="border-l pl-4"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <div className="font-serif text-5xl text-[var(--color-accent)] md:text-6xl">
                <Counter to={metric.value} suffix={metric.suffix} />
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[var(--fg-muted)]">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Indicateur scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
          Scroll
        </span>
        <motion.span
          animate={{ scaleX: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-[1px] w-16 origin-left bg-[var(--color-accent)]"
        />
      </motion.div>
    </section>
  );
}

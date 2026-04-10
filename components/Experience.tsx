"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
}

const JOBS: Job[] = [
  {
    company: "SAPIENDO · Lyon",
    role: "Lead Developer Front-End",
    period: "Juil. 2021 — Oct. 2025",
    description:
      "Lead technique sur l'architecture et les choix technologiques du produit principal. Développement de plateformes SPA Vue.js + Laravel pour la gestion de la retraite, mise en place et maintenance de tests end-to-end avec Cypress, et formation continue des équipes sur Laravel et les bonnes pratiques front-end.",
    stack: ["Vue.js", "Laravel", "Cypress", "TypeScript", "SASS"],
  },
  {
    company: "Horoquartz · Lyon",
    role: "Développeur Front-End",
    period: "Sept. 2020 — Juin 2021",
    description:
      "Développement de solutions ReactJS pour la gestion des temps et la planification. Maintenance et évolution du produit principal de l'éditeur, création d'une bibliothèque de composants réutilisables avec Storybook, intégration de l'UI interne avec SASS et HTML5/CSS3.",
    stack: ["React", "Storybook", "SASS", "HTML5/CSS3"],
  },
  {
    company: "Docapost Agility · Sotteville-lès-Rouen",
    role: "Développeur Full-Stack",
    period: "Mars 2016 — Sept. 2020",
    description:
      "Quatre années de full-stack : développement d'applications web et mobile avec React, React Native et Angular ; architecture et back-end avec NestJS, NodeJS, PHP et Java ; mise en place d'environnements Docker et pipelines CI/CD ; tests Jest, Enzyme, Selenium ; gestion d'un monorepo Lerna et création de bibliothèques de composants.",
    stack: ["React Native", "Angular", "NestJS", "Lerna", "Docker"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="04"
          label="Expérience"
          title="Dix ans, quatre maisons, une obsession."
          highlight="obsession."
          description="Du junior qui découvrait le monitoring au lead qui forme la prochaine génération. Voilà le parcours."
        />

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
            {JOBS.map((job, i) => {
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

        {/* Formation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mt-24"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              Formation
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="card p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                2012 — 2014
              </div>
              <h3 className="mt-2 font-serif text-2xl">BTS SIO option SLAM</h3>
              <div className="text-sm text-[var(--fg-muted)]">Campus La Chataigneraie</div>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Solutions Logicielles et Applications Métiers
              </p>
            </div>
            <div className="card p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                2010 — 2011
              </div>
              <h3 className="mt-2 font-serif text-2xl">Baccalauréat STG option GSI</h3>
              <div className="text-sm text-[var(--fg-muted)]">Lycée Gustave Flaubert</div>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Gestion des Systèmes d'Information
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

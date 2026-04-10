"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import TiltCard from "./TiltCard";
import PulseSandbox from "./PulseSandbox";

interface Project {
  name: string;
  tagline: string;
  description: string;
  role: string;
  tags: string[];
  gradient: string;
  href: string;
  /** Texte du lien — par défaut "Voir le projet" */
  linkLabel?: string;
  /** Image optionnelle. Drop-in dans /public puis renseigner le chemin. */
  image?: string;
  /** Si true, remplace le visuel par le sandbox Pulse JS */
  showSandbox?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: "Pulse JS Framework",
    tagline: "Framework JavaScript déclaratif zéro-dépendance",
    description:
      "Mon projet open-source phare. Un framework DOM déclaratif basé sur des sélecteurs CSS, sans build, sans dépendances. Pensé pour repenser la simplicité des SPA modernes.",
    role: "Créateur & Mainteneur principal",
    tags: ["JavaScript", "Open Source", "MIT"],
    href: "https://pulse-js.fr",
    linkLabel: "Voir Pulse JS",
    showSandbox: true,
    gradient:
      "linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #16213e 100%), radial-gradient(at top right, rgba(200,255,0,0.4), transparent)",
  },
  {
    name: "SAPIENDO — Plateforme retraite",
    tagline: "SPA Vue.js + Laravel pour la gestion de la retraite",
    description:
      "Plateforme SaaS de services pour les clients du cabinet SAPIENDO. Lead technique sur l'architecture, choix technologiques du produit principal et formation continue de l'équipe sur Laravel et les bonnes pratiques front-end.",
    role: "Lead Developer Front-End — SAPIENDO",
    tags: ["Vue.js", "Laravel", "Cypress", "SPA"],
    href: "https://www.sapiendo.fr",
    linkLabel: "sapiendo.fr",
    gradient:
      "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 50%, #4a7ab8 100%)",
  },
  {
    name: "Horoquartz — Gestion des temps",
    tagline: "Application ReactJS de planification & gestion des temps",
    description:
      "Maintenance et évolution du produit principal de l'éditeur Horoquartz, leader français de la gestion des temps. Création de composants réutilisables avec Storybook et intégration de l'UI interne en SASS et HTML5/CSS3.",
    role: "Développeur Front-End — Horoquartz",
    tags: ["React", "Storybook", "SASS", "Design System"],
    href: "https://www.horoquartz.com",
    linkLabel: "horoquartz.com",
    gradient:
      "linear-gradient(135deg, #134e5e 0%, #2d7a8a 50%, #71b280 100%)",
  },
  {
    name: "Docapost Agility — Apps mobile & web",
    tagline: "Apps cross-platform React Native + back NestJS/NodeJS",
    description:
      "Quatre années de développement full-stack pour Docapost Agility : applications web et mobile (React, React Native, Angular), back-end NestJS / NodeJS / Java, monorepo Lerna, environnements Docker et pipelines CI/CD complets.",
    role: "Développeur Full-Stack — Docapost Agility",
    tags: ["React Native", "NestJS", "Lerna", "Docker"],
    href: "https://www.docaposte.com",
    linkLabel: "docaposte.com",
    gradient:
      "linear-gradient(135deg, #2d1b3d 0%, #44318d 50%, #6c4ab6 100%)",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="03"
          label="Projets sélectionnés"
          title="Cinq histoires que je suis fier d'avoir écrites."
          highlight="fier"
          description="Une sélection de projets sur lesquels j'ai eu un impact technique et humain réel — du cadrage à la mise en production."
        />

        <div className="space-y-8">
          {PROJECTS.map((project, i) => {
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <TiltCard intensity={4} className="group">
                <article className="card relative overflow-hidden p-6 md:p-10">
                <div
                  className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${
                    isReversed ? "md:[&>*:first-child]:order-2" : ""
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
                          <div
                            className="absolute inset-0"
                            style={{ background: project.gradient }}
                          />
                          <div className="absolute inset-0 bg-grid opacity-30" />
                        </>
                      )}
                      {/* Mock window chrome pour donner l'illusion d'un écran */}
                      <div className="absolute left-4 top-4 flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                      </div>
                      <div className="absolute right-4 bottom-4 font-mono text-[10px] uppercase tracking-widest text-white/60">
                        {project.tags[0]}
                      </div>
                    </div>
                  )}

                  {/* Contenu */}
                  <div style={{ transform: "translateZ(20px)" }}>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </div>
                    <h3 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-base text-[var(--fg-muted)]">
                      {project.tagline}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] transition-colors group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]"
                          style={{ borderColor: "var(--border-strong)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

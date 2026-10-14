import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";

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
    name: "Docaposte Agility — Apps mobile & web",
    tagline: "Apps cross-platform React Native + back NestJS/NodeJS",
    description:
      "Quatre années de lead technique pour Docaposte Agility : pilotage de l'architecture, applications web et mobile (React, React Native, Angular), back-end NestJS / NodeJS / Java, monorepo Lerna, environnements Docker et pipelines GitLab CI/CD complets.",
    role: "Lead Full-Stack Developer — Docaposte Agility",
    tags: ["React Native", "NestJS", "Lerna", "Docker"],
    href: "https://www.docaposte.com",
    linkLabel: "docaposte.com",
    gradient: "linear-gradient(135deg, #2d1b3d 0%, #44318d 50%, #6c4ab6 100%)",
  },
  {
    name: "SAPIENDO — Plateforme retraite",
    tagline: "SPA Vue.js + Laravel pour la gestion de la retraite",
    description:
      "Plateforme SaaS de services pour les clients du cabinet SAPIENDO. Développement full-stack Vue.js + Laravel, conception d'API REST et de la logique métier, mise en place des tests end-to-end avec Cypress et formation de l'équipe sur Laravel.",
    role: "Développeur Full-Stack — SAPIENDO",
    tags: ["Vue.js", "Laravel", "Cypress", "SPA"],
    href: "https://www.sapiendo.fr",
    linkLabel: "sapiendo.fr",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 50%, #4a7ab8 100%)",
  },
  {
    name: "Horoquartz — Gestion des temps",
    tagline: "Application ReactJS de planification & gestion des temps",
    description:
      "Plus de quatre ans sur le produit principal de l'éditeur Horoquartz, leader français de la gestion des temps : développement en React, puis conception d'un design system interne sous Storybook avec SASS et HTML5/CSS3.",
    role: "Développeur Front-End — Horoquartz",
    tags: ["React", "Storybook", "SASS", "Design System"],
    href: "https://www.horoquartz.com",
    linkLabel: "horoquartz.com",
    gradient: "linear-gradient(135deg, #134e5e 0%, #2d7a8a 50%, #71b280 100%)",
  },
];

const COUNT_LABELS = [
  "Zéro",
  "Une",
  "Deux",
  "Trois",
  "Quatre",
  "Cinq",
  "Six",
  "Sept",
  "Huit",
  "Neuf",
  "Dix",
] as const;

export default function Projects() {
  const countLabel = COUNT_LABELS[PROJECTS.length] ?? `${PROJECTS.length}`;

  return (
    <section id="projects" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="03"
          label="Projets sélectionnés"
          title={`${countLabel} histoires que je suis fier d'avoir écrites.`}
          highlight="fier"
          description="Une sélection de projets sur lesquels j'ai eu un impact technique et humain réel — du cadrage à la mise en production."
          bigSymbol="git"
        />

        <div className="space-y-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              total={PROJECTS.length}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

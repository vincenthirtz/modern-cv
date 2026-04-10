import SectionTitle from "./SectionTitle";
import MotionInView from "./MotionInView";
import ExperienceTimeline from "./ExperienceTimeline";

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

        <ExperienceTimeline jobs={JOBS} />

        {/* Formation */}
        <MotionInView delay={0} className="mt-24">
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
                Gestion des Systèmes d&apos;Information
              </p>
            </div>
          </div>
        </MotionInView>
      </div>
    </section>
  );
}

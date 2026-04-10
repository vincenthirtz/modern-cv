"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import Marquee from "./Marquee";

interface Skill {
  name: string;
  level: number; // 0..5
}

interface Category {
  title: string;
  icon: string;
  skills: Skill[];
  /** Classes Tailwind pour le bento grid (col-span / row-span) */
  span: string;
}

// Layout bento : 6 colonnes desktop. Total 12 col-span sur 2 rangées.
// Rang 1: Frontend(4) + Backend(2) = 6
// Rang 2: Tests(2) + DevOps(2) + Leadership(2) = 6
const CATEGORIES: Category[] = [
  {
    title: "Frontend",
    icon: "◐",
    span: "md:col-span-4",
    skills: [
      { name: "React / React Native", level: 5 },
      { name: "Vue.js", level: 5 },
      { name: "Angular", level: 4 },
      { name: "TypeScript", level: 5 },
      { name: "SASS / Tailwind", level: 5 },
    ],
  },
  {
    title: "Backend",
    icon: "◑",
    span: "md:col-span-2",
    skills: [
      { name: "Node.js", level: 4 },
      { name: "NestJS", level: 4 },
      { name: "Laravel / PHP", level: 4 },
      { name: "Java", level: 3 },
    ],
  },
  {
    title: "Tests & Qualité",
    icon: "◒",
    span: "md:col-span-2",
    skills: [
      { name: "Cypress (E2E)", level: 5 },
      { name: "Jest", level: 5 },
      { name: "Enzyme", level: 4 },
      { name: "Selenium", level: 4 },
      { name: "Storybook", level: 5 },
    ],
  },
  {
    title: "DevOps & Outils",
    icon: "◓",
    span: "md:col-span-2",
    skills: [
      { name: "Docker", level: 4 },
      { name: "GitLab CI/CD", level: 4 },
      { name: "Lerna (monorepo)", level: 4 },
      { name: "Bootstrap / Material UI", level: 5 },
    ],
  },
  {
    title: "Leadership & Méthodes",
    icon: "◉",
    span: "md:col-span-2",
    skills: [
      { name: "Architecture SPA", level: 5 },
      { name: "Lead technique", level: 5 },
      { name: "Formation / Mentorat", level: 5 },
      { name: "Agile / Scrum", level: 5 },
    ],
  },
];

const MARQUEE_TECHS = [
  "React",
  "Vue.js",
  "Angular",
  "TypeScript",
  "NestJS",
  "Node.js",
  "Laravel",
  "Cypress",
  "Storybook",
  "Docker",
  "GitLab",
  "React Native",
  "SASS",
];

export default function Expertise() {
  return (
    <section id="expertise" className="relative scroll-mt-32 py-32">
      <div className="px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            number="02"
            label="Expertise"
            title="Une stack maîtrisée, pas juste essayée."
            highlight="maîtrisée,"
            description="Dix ans à explorer, casser et rebâtir. Voici ce que je manie au quotidien — sans buzzwords."
          />
        </div>
      </div>

      {/* Marquee plein écran */}
      <div className="my-16">
        <Marquee items={MARQUEE_TECHS} speed={50} />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className={`card group relative overflow-hidden p-6 ${cat.span}`}
            >
              {/* Glow accent qui apparait au hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(400px circle at 50% 0%, rgba(200,255,0,0.08), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)]">
                    {cat.title}
                  </span>
                  <span className="text-2xl text-[var(--color-accent)] transition-transform duration-500 group-hover:rotate-180">
                    {cat.icon}
                  </span>
                </div>
                <ul
                  className={`mt-6 space-y-4 ${
                    cat.span.includes("col-span-4") ? "md:grid md:grid-cols-2 md:gap-x-8 md:space-y-0 md:[&>li]:mb-4" : ""
                  }`}
                >
                  {cat.skills.map((skill) => (
                    <li key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="font-mono text-[10px] text-[var(--fg-dim)]">
                          {skill.level}/5
                        </span>
                      </div>
                      {/* Jauge animée */}
                      <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
                          className="h-full bg-[var(--color-accent)]"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

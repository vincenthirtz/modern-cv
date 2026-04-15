"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SectionTitle from "./SectionTitle";
import Marquee from "./Marquee";

interface Skill {
  name: string;
  level: number;
}

interface Category {
  title: string;
  icon: string;
  skills: Skill[];
  span: string;
}

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

function SkillBar({ skill, parentInView }: { skill: Skill; parentInView: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldAnimate = parentInView && inView;

  return (
    <li ref={ref}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span>{skill.name}</span>
        <span className="font-mono text-[0.625rem] text-[var(--fg-dim)]">{skill.level}/5</span>
      </div>
      {/* Jauge animée */}
      <div
        className="h-[3px] w-full overflow-hidden rounded-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full bg-[var(--color-accent)]"
          style={{
            width: shouldAnimate ? `${(skill.level / 5) * 100}%` : "0%",
            transition: "width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s",
          }}
        />
      </div>
    </li>
  );
}

export default function Expertise() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

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
            bigSymbol="{ }"
          />
        </div>
      </div>

      {/* Marquee plein écran */}
      <div className="my-16">
        <Marquee items={MARQUEE_TECHS} speed={50} />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.title}
              className={`card group relative overflow-hidden p-6 ${cat.span}`}
              style={{
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              {/* Glow accent qui apparait au hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(400px circle at 50% 0%, rgba(200,255,0,0.08), transparent 70%)",
                }}
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
                    cat.span.includes("col-span-4")
                      ? "md:grid md:grid-cols-2 md:gap-x-8 md:space-y-0 md:[&>li]:mb-4"
                      : ""
                  }`}
                >
                  {cat.skills.map((skill) => (
                    <SkillBar key={skill.name} skill={skill} parentInView={gridInView} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

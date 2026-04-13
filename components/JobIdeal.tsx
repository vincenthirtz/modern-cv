"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SectionTitle from "./SectionTitle";

interface CriteriaItem {
  icon: string;
  title: string;
  description: string;
}

interface DealBreaker {
  icon: string;
  label: string;
}

const CRITERIA: CriteriaItem[] = [
  {
    icon: "◆",
    title: "Produit ambitieux",
    description:
      "Un produit à forte valeur ajoutée, avec de vrais enjeux techniques — pas du CRUD habillé en SaaS. Je veux résoudre des problèmes complexes qui ont un impact concret sur les utilisateurs.",
  },
  {
    icon: "▲",
    title: "Autonomie & confiance",
    description:
      "La liberté de proposer des solutions, de challenger les choix et de porter la vision technique. Un environnement où le Lead n'est pas juste un dev senior qui fait des code reviews.",
  },
  {
    icon: "✦",
    title: "Stack moderne",
    description:
      "TypeScript, React/Vue/Svelte, testing solide, CI/CD, design system. Je veux travailler avec des outils qui permettent d'aller vite sans sacrifier la qualité.",
  },
  {
    icon: "●",
    title: "Culture technique forte",
    description:
      "Des pairs de qualité, du pair programming, des tech talks internes, du temps pour la veille. L'excellence technique n'est pas un luxe, c'est un investissement.",
  },
  {
    icon: "◇",
    title: "Équipe à taille humaine",
    description:
      "Une équipe front de 3 à 8 personnes où je peux avoir un vrai impact sur la montée en compétences, l'architecture et les process. Pas un rouage dans une machine de 200 devs.",
  },
  {
    icon: "▶",
    title: "Équilibre & flexibilité",
    description:
      "Télétravail hybride ou full remote, horaires flexibles, pas de présentéisme. La confiance se mesure aux résultats, pas aux heures de chaise.",
  },
];

const DEALBREAKERS: DealBreaker[] = [
  { icon: "✕", label: "Micro-management" },
  { icon: "✕", label: "Zéro tests en prod" },
  { icon: "✕", label: "Legacy sans roadmap de modernisation" },
  { icon: "✕", label: '"On a toujours fait comme ça"' },
  { icon: "✕", label: "Pas de budget formation / veille" },
];

const BONUS: DealBreaker[] = [
  { icon: "♥", label: "Open source encouragé" },
  { icon: "♥", label: "Conférences & meetups sponsorisés" },
  { icon: "♥", label: "Side projects tolérés" },
  { icon: "♥", label: "Impact social ou environnemental" },
  { icon: "♥", label: "Lyon ou full remote" },
];

export default function JobIdeal() {
  const criteriaRef = useRef<HTMLDivElement>(null);
  const dealbreakersRef = useRef<HTMLDivElement>(null);
  const bonusRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const criteriaInView = useInView(criteriaRef, { once: true, amount: 0.1 });
  const dealbreakersInView = useInView(dealbreakersRef, { once: true, amount: 0.3 });
  const bonusInView = useInView(bonusRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true });

  return (
    <section className="relative scroll-mt-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="01"
          label="Mon job idéal"
          title="Ce que je cherche vraiment."
          highlight="vraiment"
          description="Après 10+ ans dans le front-end, je sais ce qui me fait avancer — et ce qui me freine. Voici ce que je recherche dans mon prochain poste de Lead Developer."
          bigSymbol="~/"
        />

        {/* Critères principaux */}
        <div ref={criteriaRef} className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((item, i) => (
            <article
              key={item.title}
              className="group rounded-2xl border p-6 transition-colors hover:border-[var(--color-accent)]"
              style={{
                borderColor: "var(--border-strong)",
                background: "color-mix(in oklab, var(--elevated) 50%, transparent)",
                opacity: criteriaInView ? 1 : 0,
                transform: criteriaInView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, border-color 0.3s`,
              }}
            >
              <span
                aria-hidden
                className="mb-4 block text-2xl text-[var(--color-accent)] transition-transform group-hover:rotate-12"
              >
                {item.icon}
              </span>
              <h3 className="mb-2 font-serif text-xl leading-tight">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{item.description}</p>
            </article>
          ))}
        </div>

        {/* Dealbreakers + Bonus */}
        <div className="mt-24 grid gap-16 md:grid-cols-2">
          {/* Dealbreakers */}
          <div
            ref={dealbreakersRef}
            style={{
              opacity: dealbreakersInView ? 1 : 0,
              transform: dealbreakersInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <h3 className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              <span className="text-red-400">✕</span>
              <span className="block h-[1px] w-6 bg-red-400/40" />
              Rédhibitoire
            </h3>
            <ul className="space-y-3">
              {DEALBREAKERS.map((item, i) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm"
                  style={{
                    borderColor: "var(--border)",
                    opacity: dealbreakersInView ? 1 : 0,
                    transform: dealbreakersInView ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  <span className="text-red-400" aria-hidden>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bonus */}
          <div
            ref={bonusRef}
            style={{
              opacity: bonusInView ? 1 : 0,
              transform: bonusInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
            }}
          >
            <h3 className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              <span className="text-[var(--color-accent)]">♥</span>
              <span className="block h-[1px] w-6 bg-[var(--color-accent)]/40" />
              Gros bonus
            </h3>
            <ul className="space-y-3">
              {BONUS.map((item, i) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm"
                  style={{
                    borderColor: "var(--border)",
                    opacity: bonusInView ? 1 : 0,
                    transform: bonusInView ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  <span className="text-[var(--color-accent)]" aria-hidden>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-24 rounded-2xl border p-8 text-center md:p-12"
          style={{
            borderColor: "var(--border-strong)",
            background: "color-mix(in oklab, var(--elevated) 30%, transparent)",
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="mx-auto max-w-xl font-serif text-2xl leading-snug md:text-3xl">
            Ça ressemble à votre boîte ?{" "}
            <span className="text-[var(--color-accent)]">Parlons-en.</span>
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--fg-muted)]">
            Je suis ouvert aux opportunités qui cochent la majorité de ces cases. Pas besoin de tout
            cocher — le feeling humain compte autant que la stack.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-accent-contrast)",
              }}
            >
              Me contacter
            </a>
            <a
              href="/cv"
              className="rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              Voir mon CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import SectionTitle from "./SectionTitle";
import MotionInView, { MotionInViewItem } from "./MotionInView";
import { ARTICLES } from "@/lib/articles";

const VALUES = [
  {
    title: "Clean Code",
    desc: "J'écris du code lisible et maintenable. La clarté n'est pas un luxe, c'est un investissement.",
    icon: "{ }",
  },
  {
    title: "Architecture First",
    desc: "Je pense système avant de penser feature. Les bonnes décisions structurelles évitent les dettes.",
    icon: "◇",
  },
  {
    title: "Team Player",
    desc: "Le meilleur code naît de la collaboration. Je crois aux revues, au pair, à la confiance.",
    icon: "⌖",
  },
  {
    title: "Continuous Learner",
    desc: "La tech évolue, moi aussi. Curiosité méthodique et veille permanente.",
    icon: "↗",
  },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="01"
          label="À propos"
          title="Designer de systèmes, pas seulement de features."
          highlight="systèmes"
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Texte 60% */}
          <div className="lg:col-span-3 space-y-6 text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
            <MotionInView>
              <p>
                Je m&apos;appelle <span className="text-[var(--fg)]">Vincent Hirtz</span>.
                Développeur front-end passionné, avec plus de 10 ans d&apos;expérience à concevoir
                des solutions web modernes et performantes pour des équipes qui veulent aller vite
                sans sacrifier la qualité.
              </p>
            </MotionInView>
            <MotionInView delay={0.1}>
              <p>
                Expert en React, Vue.js et Angular, je suis spécialisé dans le développement
                d&apos;applications SPA complexes, la mise en place de tests end-to-end, et
                l&apos;architecture front-end scalable. Ces dernières années, j&apos;ai dirigé
                l&apos;équipe technique de SAPIENDO sur des plateformes Vue.js + Laravel pour la
                gestion de la retraite.
              </p>
            </MotionInView>
            <MotionInView delay={0.2}>
              <p>
                Quand je ne travaille pas, je contribue à l&apos;open source — notamment{" "}
                <span className="text-[var(--fg)]">Pulse JS</span>, un framework déclaratif
                zéro-dépendance que je développe pour repenser la façon dont on construit des SPA
                modernes. Curiosité infinie pour les nouvelles technos, et un faible pour ce qui
                dure.
              </p>
            </MotionInView>
          </div>

          {/* Dernières notes */}
          <MotionInView direction="none" duration={0.8} className="relative lg:col-span-2">
            <div
              className="flex h-full flex-col rounded-2xl border p-6"
              style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
            >
              <h3 className="mb-5 font-mono text-[11px] uppercase tracking-widest text-[var(--fg-muted)]">
                Dernières notes
              </h3>
              <ul className="flex flex-1 flex-col gap-4">
                {ARTICLES.slice(0, 4).map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/notes/${article.slug}`}
                      className="group flex flex-col gap-1.5 rounded-xl border p-4 transition-colors hover:border-[var(--color-accent)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]"
                          style={{ borderColor: "var(--color-accent)" }}
                        >
                          {article.category}
                        </span>
                        <span className="font-mono text-[9px] text-[var(--fg-dim)]">
                          {article.readTime}
                        </span>
                      </div>
                      <span className="text-sm font-medium leading-snug transition-colors group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/notes"
                className="mt-5 inline-flex items-center gap-1.5 self-end font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Toutes les notes <span>→</span>
              </Link>
            </div>
          </MotionInView>
        </div>

        {/* Valeurs */}
        <MotionInView
          amount={0.2}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((value) => (
            <MotionInViewItem key={value.title} className="card group p-6">
              <div className="font-mono text-3xl text-[var(--color-accent)] transition-transform group-hover:scale-110">
                {value.icon}
              </div>
              <h3 className="mt-4 font-serif text-2xl">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{value.desc}</p>
            </MotionInViewItem>
          ))}
        </MotionInView>
      </div>
    </section>
  );
}

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import MotionInView, { MotionInViewItem } from "./MotionInView";

/**
 * Active la vraie photo. Mets `true` quand tu auras déposé `public/avatar.jpg`.
 * Sinon le gradient stylisé reste affiché.
 */
const HAS_AVATAR = false;

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

          {/* Photo 40% */}
          <MotionInView direction="none" duration={0.8} className="relative lg:col-span-2">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {/* Toujours affiché en fallback / arrière-plan stylisé */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 120% at 0% 0%, #1a1a20 0%, #0a0a0b 60%), linear-gradient(135deg, rgba(200,255,0,0.15), transparent)",
                }}
              />
              <div className="absolute inset-0 bg-grid opacity-30" />

              {/* Vraie photo si HAS_AVATAR — overlay accent appliqué dessus */}
              {HAS_AVATAR && (
                <Image
                  src="/avatar.jpg"
                  alt="Vincent Hirtz, Lead Developer Front-End"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-cover grayscale-[20%] mix-blend-luminosity"
                />
              )}

              <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                  background: "linear-gradient(180deg, transparent 40%, rgba(200,255,0,0.25))",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="font-serif text-7xl text-[var(--color-accent)]">VH</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                  Lyon · Remote-friendly
                </div>
              </div>
              {/* Bordure accent décalée */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-2 h-full w-full rounded-2xl border"
                style={{ borderColor: "var(--color-accent)", opacity: 0.25 }}
              />
            </div>
          </MotionInView>
        </div>

        {/* Valeurs */}
        <MotionInView
          stagger={0.1}
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

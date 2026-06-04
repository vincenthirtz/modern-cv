"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SectionTitle from "./SectionTitle";
import Counter from "./Counter";
import MagneticButton from "./MagneticButton";
import TiltCard from "./TiltCard";

const SITE_URL = "https://owwomenscup.fr";

interface Value {
  symbol: string;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    symbol: "◈",
    title: "Communauté",
    description:
      "Un espace francophone où les joueuses se rencontrent, s'entraident et progressent ensemble. Discord actif, guides pour capitaines, accompagnement des nouvelles équipes.",
  },
  {
    symbol: "▲",
    title: "Compétition",
    description:
      "Un tournoi Overwatch exigeant et structuré : 16 équipes, un format clair et un niveau de jeu qui pousse chaque joueuse à donner le meilleur d'elle-même.",
  },
  {
    symbol: "✦",
    title: "Bienveillance",
    description:
      "Un environnement 100 % féminin, inclusif et safe. Soutien affirmé aux initiatives LGBTQ+, scrims caritatifs (IDAHOBIT) et zéro tolérance pour la toxicité.",
  },
];

interface Stat {
  to: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { to: 16, suffix: "", label: "Équipes en lice" },
  { to: 100, suffix: "%", label: "Féminin & francophone" },
  { to: 5, suffix: "", label: "Plateformes communautaires" },
];

interface Social {
  name: string;
  href: string;
  handle: string;
}

const SOCIALS: Social[] = [
  { name: "Twitch", href: "https://twitch.tv", handle: "Lives & matchs" },
  { name: "Discord", href: "https://discord.com", handle: "La communauté" },
  { name: "TikTok", href: "https://tiktok.com", handle: "Coulisses" },
  { name: "Instagram", href: "https://instagram.com", handle: "Actus" },
  { name: "YouTube", href: "https://youtube.com", handle: "Replays" },
];

/** Applique la classe .is-in quand l'élément entre dans le viewport. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <div
      ref={ref}
      className={`assoc-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Association() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Parallaxe 3D de la hero pilotée par la souris (variables CSS --rx/--ry)
  useEffect(() => {
    const scene = sceneRef.current;
    const orb = orbRef.current;
    if (!scene || !orb) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: globalThis.MouseEvent) {
      const rect = scene!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      orb!.style.setProperty("--ry", `${px * 22}deg`);
      orb!.style.setProperty("--rx", `${-py * 22}deg`);
    }
    function onLeave() {
      orb!.style.setProperty("--ry", "0deg");
      orb!.style.setProperty("--rx", "0deg");
    }

    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="assoc">
      {/* ───────────────────────── HERO 3D ───────────────────────── */}
      <section ref={sceneRef} className="assoc-scene relative overflow-hidden px-6 pt-16 pb-24">
        <div className="assoc-aurora pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div
          className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40"
          aria-hidden
        />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Colonne texte */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                <span
                  className="pulse-dot h-2 w-2 rounded-full"
                  style={{ background: "#22c55e" }}
                  aria-hidden
                />
                Association · Esport
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-tight">
                OW <span className="assoc-gradient-text">Women&apos;s</span> Cup
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg text-[var(--fg-muted)]">
                Le tournoi <strong className="text-[var(--fg)]">Overwatch 100 % féminin</strong> et
                francophone. Communauté, compétition et bienveillance — une scène esport pensée pour
                les joueuses, par la communauté.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <MagneticButton
                  href={SITE_URL}
                  target="_blank"
                  ariaLabel="Visiter owwomenscup.fr (nouvel onglet)"
                  className="btn-accent"
                >
                  Découvrir le projet <span aria-hidden>↗</span>
                </MagneticButton>
                <MagneticButton
                  href={`${SITE_URL}/#inscription`}
                  target="_blank"
                  ariaLabel="Inscrire une équipe (nouvel onglet)"
                  className="btn-ghost"
                >
                  Inscrire une équipe
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
                Lancement · 18 septembre 2026
              </p>
            </Reveal>
          </div>

          {/* Colonne scène 3D : badge flottant + anneaux coniques */}
          <div className="relative flex items-center justify-center" aria-hidden>
            <div
              ref={orbRef}
              className="assoc-orb relative grid aspect-square w-full max-w-sm place-items-center"
            >
              {/* Anneaux coniques en rotation */}
              <div
                className="assoc-ring absolute inset-0 rounded-full opacity-60"
                style={{
                  mask: "radial-gradient(closest-side, transparent 67%, #000 69%, #000 72%, transparent 74%)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent 67%, #000 69%, #000 72%, transparent 74%)",
                  transform: "translateZ(40px)",
                }}
              />
              <div
                className="assoc-ring assoc-ring--slow absolute inset-6 rounded-full opacity-40"
                style={{
                  mask: "radial-gradient(closest-side, transparent 80%, #000 82%, #000 84%, transparent 86%)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent 80%, #000 82%, #000 84%, transparent 86%)",
                  transform: "translateZ(80px)",
                }}
              />

              {/* Cœur du badge */}
              <div
                className="relative grid h-44 w-44 place-items-center rounded-[2rem] border sm:h-52 sm:w-52"
                style={{
                  borderColor: "var(--border-strong)",
                  background:
                    "radial-gradient(circle at 30% 25%, rgba(255,122,24,0.25), transparent 55%), radial-gradient(circle at 75% 80%, rgba(138,92,255,0.25), transparent 55%), var(--elevated)",
                  boxShadow: "0 40px 80px -30px rgba(255,46,135,0.4)",
                  transform: "translateZ(120px)",
                }}
              >
                <span className="assoc-gradient-text font-serif text-7xl leading-none sm:text-8xl">
                  OW
                </span>
                <span className="absolute bottom-5 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-[var(--fg-muted)]">
                  2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-3xl border sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="bg-[var(--elevated)] px-8 py-10 text-center">
                <div className="assoc-gradient-text font-serif text-5xl md:text-6xl">
                  <Counter to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── VALEURS (cartes 3D) ───────────────────────── */}
      <section className="assoc-scene px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            number="01"
            label="Le projet"
            title="Communauté, compétition, bienveillance."
            highlight="bienveillance"
            description="OW Women's Cup, c'est une association qui fait vivre une scène esport exigeante et profondément inclusive autour d'Overwatch."
            bigSymbol="⌘"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.12}>
                <article className="assoc-card h-full rounded-3xl border bg-[var(--elevated)] p-8">
                  <span
                    aria-hidden
                    className="assoc-gradient-text inline-block text-4xl"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {value.symbol}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl md:text-3xl">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
                    {value.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── MISSION (carte tilt) ───────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <TiltCard intensity={5} className="group">
              <div
                className="relative overflow-hidden rounded-[2rem] border p-10 md:p-16"
                style={{
                  borderColor: "var(--border-strong)",
                  background:
                    "linear-gradient(135deg, rgba(255,122,24,0.08), rgba(138,92,255,0.08))",
                }}
              >
                <div
                  className="bg-grid pointer-events-none absolute inset-0 opacity-20"
                  aria-hidden
                />
                <div className="relative" style={{ transform: "translateZ(40px)" }}>
                  <p className="max-w-3xl font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] leading-tight">
                    «&nbsp;Donner aux joueuses une scène où{" "}
                    <span className="assoc-gradient-text">briller</span>, dans un cadre exigeant et
                    bienveillant.&nbsp;»
                  </p>
                  <p className="mt-6 max-w-2xl text-base text-[var(--fg-muted)]">
                    Né dans la communauté francophone d&apos;Overwatch, le projet a connu une
                    transition de gouvernance en mai 2026 et continue d&apos;être porté par des
                    bénévoles passionné·e·s, soutenu par des partenaires locaux.
                  </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── RÉSEAUX ───────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            number="02"
            label="Rejoindre"
            title="La communauté vit partout."
            highlight="partout"
            description="Suivez les matchs, les coulisses et les annonces sur tous les canaux de l'association."
            bigSymbol="@"
          />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIALS.map((social, i) => (
              <li key={social.name}>
                <Reveal delay={i * 0.08}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} de OW Women's Cup (nouvel onglet)`}
                    className="assoc-shine group flex items-center justify-between rounded-2xl border bg-[var(--elevated)] px-6 py-5 transition-colors hover:border-[var(--color-accent)]"
                  >
                    <span>
                      <span className="block font-serif text-xl transition-colors group-hover:text-[var(--color-accent)]">
                        {social.name}
                      </span>
                      <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
                        {social.handle}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="text-xl text-[var(--fg-dim)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                    >
                      ↗
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────────────── CTA FINAL ───────────────────────── */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[2rem] border px-8 py-16 text-center md:px-16"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <div className="assoc-aurora pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative">
                <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-tight">
                  Une équipe ? Une envie de <span className="assoc-gradient-text">soutenir</span> ?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[var(--fg-muted)]">
                  Il reste des places dans le tournoi. Capitaines, partenaires, bénévoles — la porte
                  est grande ouverte.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <MagneticButton
                    href={SITE_URL}
                    target="_blank"
                    ariaLabel="Aller sur owwomenscup.fr (nouvel onglet)"
                    className="btn-accent"
                  >
                    owwomenscup.fr <span aria-hidden>↗</span>
                  </MagneticButton>
                  <MagneticButton href="/contact" className="btn-ghost">
                    Me contacter
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

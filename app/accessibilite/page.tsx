import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité — Vincent Hirtz",
  description:
    "Déclaration d'accessibilité du site vincenthirtz.fr — niveau de conformité WCAG 2.2 AA, méthodologie, dérogations et contact.",
  alternates: { canonical: "https://vincenthirtz.fr/accessibilite" },
  robots: { index: true, follow: true },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://vincenthirtz.fr" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Accessibilité",
      item: "https://vincenthirtz.fr/accessibilite",
    },
  ],
};

export default function AccessibilitePage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-6xl">
        {/* Fil d'Ariane */}
        <nav
          aria-label="Fil d'ariane"
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">Accessibilité</span>
        </nav>

        {/* En-tête */}
        <div className="mb-16">
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            Déclaration d&apos;
            <span className="italic text-[var(--color-accent)]">accessibilité</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--fg-muted)]">
            Vincent Hirtz s&apos;engage à rendre son site internet accessible conformément à
            l&apos;article 47 de la loi n° 2005-102 du 11 février 2005 et à la directive européenne
            (UE) 2016/2102.
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-12 text-[var(--fg-muted)]">
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              État de conformité
            </h2>
            <p className="text-sm leading-relaxed">
              Le site{" "}
              <a
                href="https://vincenthirtz.fr"
                className="text-[var(--color-accent)] transition-colors hover:underline"
              >
                vincenthirtz.fr
              </a>{" "}
              est <strong className="text-[var(--fg)]">partiellement conforme</strong> aux
              référentiels{" "}
              <abbr title="Web Content Accessibility Guidelines 2.2 niveau AA">WCAG 2.2 AA</abbr> et{" "}
              <abbr title="Référentiel Général d'Amélioration de l'Accessibilité">RGAA 4.1</abbr>.
              Des non-conformités ponctuelles subsistent, listées ci-dessous.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Résultats des tests
            </h2>
            <p className="mb-3 text-sm leading-relaxed">
              L&apos;audit automatisé, réalisé avec{" "}
              <a
                href="https://www.deque.com/axe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] transition-colors hover:underline"
              >
                axe-core
              </a>{" "}
              et intégré au pipeline de tests (Playwright), ne relève aucune violation des critères
              WCAG 2.2 niveau A et AA détectables de manière automatique sur les pages suivantes :
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed">
              <li>Accueil, Projets, Expérience, Communauté, Notes, Contact, CV</li>
              <li>Branding, Expertise, Mentions légales, Mon job idéal</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed">
              Un audit manuel complémentaire (navigation clavier, lecteurs d&apos;écran VoiceOver et
              NVDA) est effectué à chaque refonte majeure.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Contenus non accessibles
            </h2>
            <p className="mb-3 text-sm leading-relaxed">
              Malgré les efforts engagés, certains contenus présentent des limitations :
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Animations décoratives</strong> : les
                transitions de texte et les effets de scroll sont désactivés via{" "}
                <code className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono text-[11px]">
                  prefers-reduced-motion
                </code>
                , mais une lecture fine peut nécessiter quelques secondes le temps que les éléments
                apparaissent.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Aperçus de liens externes</strong> : les
                vignettes OpenGraph dépendent de sites tiers dont l&apos;image alternative
                n&apos;est pas toujours renseignée. Un fallback textuel est fourni.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Marquee technologique</strong> : la bande
                défilante de la page Expertise est dupliquée et marquée{" "}
                <code className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono text-[11px]">
                  aria-hidden
                </code>{" "}
                sur le second exemplaire. Sa vitesse n&apos;est pas modulable par
                l&apos;utilisateur.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Technologies et outils d&apos;évaluation
            </h2>
            <ul className="space-y-1 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Technologies :</strong> HTML, CSS, JavaScript,
                React 19, Next.js 15.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Outils automatisés :</strong> axe-core 4.11
                (Playwright), Lighthouse (CI).
              </li>
              <li>
                <strong className="text-[var(--fg)]">Navigateurs testés :</strong> Chromium,
                Firefox, Safari (dernières versions).
              </li>
              <li>
                <strong className="text-[var(--fg)]">Lecteurs d&apos;écran :</strong> VoiceOver
                (macOS/iOS), NVDA (Windows).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Retour d&apos;information
            </h2>
            <p className="text-sm leading-relaxed">
              Si vous rencontrez un défaut d&apos;accessibilité vous empêchant d&apos;accéder à un
              contenu, merci de me le signaler afin que je puisse y remédier. Décrivez le problème
              rencontré ainsi que la page concernée :
            </p>
            <ul className="mt-3 space-y-1 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Email :</strong>{" "}
                <a
                  href="mailto:hirtzvincent@free.fr?subject=Accessibilit%C3%A9%20vincenthirtz.fr"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  hirtzvincent@free.fr
                </a>
              </li>
              <li>
                <strong className="text-[var(--fg)]">Délai de réponse :</strong> sous 7 jours
                ouvrés.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Voies de recours
            </h2>
            <p className="text-sm leading-relaxed">
              Si, après signalement, vous ne parvenez pas à obtenir une réponse satisfaisante, vous
              pouvez :
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed">
              <li>
                Écrire un message au{" "}
                <a
                  href="https://formulaire.defenseurdesdroits.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  Défenseur des droits
                </a>
              </li>
              <li>
                Contacter le délégué du Défenseur des droits dans votre région (
                <a
                  href="https://www.defenseurdesdroits.fr/saisir/delegues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  annuaire
                </a>
                )
              </li>
              <li>
                Envoyer un courrier par la poste (gratuit, sans affranchissement) : Défenseur des
                droits — Libre réponse 71120 — 75342 Paris CEDEX 07
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Établissement de la déclaration
            </h2>
            <ul className="space-y-1 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Date d&apos;établissement :</strong> 14 avril
                2026.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Référentiel :</strong> WCAG 2.2 niveau AA, EN
                301 549 v3.2.1, RGAA 4.1.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Méthode :</strong> auto-évaluation assistée par
                outils automatisés et tests manuels.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

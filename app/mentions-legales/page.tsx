import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Mentions légales — Vincent Hirtz",
  description:
    "Mentions légales du site vincenthirtz.fr — éditeur, hébergement, propriété intellectuelle et protection des données.",
  alternates: { canonical: "https://vincenthirtz.fr/mentions-legales" },
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
      name: "Mentions légales",
      item: "https://vincenthirtz.fr/mentions-legales",
    },
  ],
};

export default function MentionsLegalesPage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-3xl">
        {/* Fil d'Ariane */}
        <nav
          aria-label="Fil d'ariane"
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">Mentions légales</span>
        </nav>

        {/* En-tête */}
        <div className="mb-16">
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            Mentions <span className="italic text-[var(--color-accent)]">légales</span>.
          </h1>
          <p className="mt-4 text-[var(--fg-muted)]">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance
            dans l&apos;économie numérique.
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-12 text-[var(--fg-muted)]">
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Éditeur du site
            </h2>
            <ul className="space-y-1 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Nom :</strong> Vincent Hirtz
              </li>
              <li>
                <strong className="text-[var(--fg)]">Statut :</strong> Personne physique
              </li>
              <li>
                <strong className="text-[var(--fg)]">Localisation :</strong> Lyon, France
              </li>
              <li>
                <strong className="text-[var(--fg)]">Email :</strong>{" "}
                <a
                  href="mailto:hirtzvincent@free.fr"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  hirtzvincent@free.fr
                </a>
              </li>
              <li>
                <strong className="text-[var(--fg)]">Site :</strong>{" "}
                <a
                  href="https://vincenthirtz.fr"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  vincenthirtz.fr
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Hébergement
            </h2>
            <ul className="space-y-1 text-sm leading-relaxed">
              <li>
                <strong className="text-[var(--fg)]">Hébergeur :</strong> Netlify, Inc.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Adresse :</strong> 512 2nd Street, Suite 200,
                San Francisco, CA 94107, États-Unis
              </li>
              <li>
                <strong className="text-[var(--fg)]">Site :</strong>{" "}
                <a
                  href="https://www.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] transition-colors hover:underline"
                >
                  netlify.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Propriété intellectuelle
            </h2>
            <p className="text-sm leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, code source, design) est la
              propriété exclusive de Vincent Hirtz, sauf mention contraire. Toute reproduction,
              distribution ou utilisation sans autorisation préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Données personnelles
            </h2>
            <p className="text-sm leading-relaxed">
              Ce site ne collecte aucune donnée personnelle. Aucun cookie de tracking, aucun outil
              d&apos;analytics tiers et aucun formulaire de collecte ne sont utilisés. La navigation
              est entièrement anonyme.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Responsabilité
            </h2>
            <p className="text-sm leading-relaxed">
              Les informations fournies sur ce site le sont à titre indicatif. Vincent Hirtz
              s&apos;efforce de maintenir des informations exactes et à jour, mais ne saurait être
              tenu responsable des erreurs, omissions ou résultats obtenus suite à
              l&apos;utilisation de ces informations.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Crédits
            </h2>
            <p className="text-sm leading-relaxed">
              Site développé avec{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] transition-colors hover:underline"
              >
                Next.js
              </a>
              ,{" "}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] transition-colors hover:underline"
              >
                Tailwind CSS
              </a>{" "}
              et hébergé sur{" "}
              <a
                href="https://www.netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] transition-colors hover:underline"
              >
                Netlify
              </a>
              . Typographies : DM Sans, Instrument Serif, JetBrains Mono (Google Fonts).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

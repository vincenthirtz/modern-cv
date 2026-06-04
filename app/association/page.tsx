import type { Metadata } from "next";
import Link from "next/link";
import Association from "@/components/Association";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "OW Women's Cup — Association esport | Vincent Hirtz",
  description:
    "OW Women's Cup : le tournoi Overwatch 100 % féminin et francophone. Une association esport portée par les valeurs de communauté, compétition et bienveillance. Lancement le 18 septembre 2026.",
  alternates: { canonical: "https://vincenthirtz.fr/association" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://vincenthirtz.fr" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Association",
      item: "https://vincenthirtz.fr/association",
    },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "OW Women's Cup",
  description:
    "Tournoi Overwatch 100 % féminin et francophone, porté par une association esport autour des valeurs de communauté, compétition et bienveillance.",
  sport: "Esports",
  url: "https://owwomenscup.fr",
};

export default function AssociationPage() {
  return (
    <main className="relative z-[2]">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={orgJsonLd} />
      <div className="px-6 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Fil d'ariane"
            className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
              Accueil
            </Link>
            <span className="text-[var(--fg-dim)]">/</span>
            <span className="text-[var(--color-accent)]">Association</span>
          </nav>
        </div>
      </div>
      <Association />
    </main>
  );
}

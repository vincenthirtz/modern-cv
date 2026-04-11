import type { Metadata } from "next";
import Link from "next/link";
import Experience from "@/components/Experience";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Expérience — Vincent Hirtz",
  description:
    "Parcours professionnel de Vincent Hirtz : 10+ ans de développement front-end, de Docapost à SAPIENDO.",
  alternates: { canonical: "https://vincenthirtz.fr/experience" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://vincenthirtz.fr",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Expérience",
      item: "https://vincenthirtz.fr/experience",
    },
  ],
};

export default function ExperiencePage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Fil d'ariane"
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">Expérience</span>
        </nav>
      </div>
      <Experience />
    </main>
  );
}

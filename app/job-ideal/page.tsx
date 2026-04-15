import type { Metadata } from "next";
import Link from "next/link";
import JobIdeal from "@/components/JobIdeal";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Mon job idéal — Vincent Hirtz, Lead Developer Front-End",
  description:
    "Ce que je recherche dans mon prochain poste de Lead Developer : produit ambitieux, stack moderne, sensibilité UI/UX, autonomie, culture technique et équilibre.",
  alternates: { canonical: "https://vincenthirtz.fr/job-ideal" },
  openGraph: {
    type: "website",
    url: "https://vincenthirtz.fr/job-ideal",
    title: "Mon job idéal — Vincent Hirtz, Lead Developer Front-End",
    description:
      "Ce que je recherche dans mon prochain poste de Lead Developer : produit ambitieux, stack moderne, sensibilité UI/UX, autonomie, culture technique et équilibre.",
    siteName: "Vincent Hirtz",
    locale: "fr_FR",
  },
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
      name: "Mon job idéal",
      item: "https://vincenthirtz.fr/job-ideal",
    },
  ],
};

export default function JobIdealPage() {
  return (
    <main id="main" className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Fil d'ariane"
          className="mb-10 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">Mon job idéal</span>
        </nav>
      </div>
      <JobIdeal />
    </main>
  );
}

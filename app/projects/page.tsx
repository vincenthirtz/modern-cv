import type { Metadata } from "next";
import Link from "next/link";
import Projects from "@/components/Projects";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Projets — Vincent Hirtz",
  description:
    "Projets et réalisations de Vincent Hirtz : Pulse JS Framework, plateformes SaaS, applications React et Vue.js.",
  alternates: { canonical: "https://vincenthirtz.fr/projects" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://vincenthirtz.fr" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projets",
      item: "https://vincenthirtz.fr/projects",
    },
  ],
};

export default function ProjectsPage() {
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
          <span className="text-[var(--color-accent)]">Projets</span>
        </nav>
      </div>
      <Projects />
    </main>
  );
}

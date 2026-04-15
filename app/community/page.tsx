import type { Metadata } from "next";
import Link from "next/link";
import Community from "@/components/Community";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Communauté — Vincent Hirtz",
  description:
    "Contributions open source, side projects et communauté de Vincent Hirtz. Créateur de Pulse JS Framework.",
  alternates: { canonical: "https://vincenthirtz.fr/community" },
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
      name: "Communauté",
      item: "https://vincenthirtz.fr/community",
    },
  ],
};

export default function CommunityPage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
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
          <span className="text-[var(--color-accent)]">Communauté</span>
        </nav>
      </div>
      <Community />
    </main>
  );
}

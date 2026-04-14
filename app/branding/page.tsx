import type { Metadata } from "next";
import Link from "next/link";
import BrandingGrid from "@/components/BrandingGrid";
import ComponentStories from "@/components/ComponentStories";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Branding — Vincent Hirtz",
  description: "Identité visuelle, palette de couleurs et thèmes du portfolio de Vincent Hirtz.",
  alternates: { canonical: "https://vincenthirtz.fr/branding" },
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
      name: "Branding",
      item: "https://vincenthirtz.fr/branding",
    },
  ],
};

export default function BrandingPage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'ariane"
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">Branding</span>
        </nav>

        {/* En-tête */}
        <div className="mb-20 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-accent)]">VH</span>
            <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              Branding
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            Palette & <span className="italic text-[var(--color-accent)]">identité</span> visuelle.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--fg-muted)]">
            Cinq thèmes, une identité. Chaque couleur est pensée pour le contraste WCAG AA en dark
            et light mode.
          </p>
        </div>

        {/* Grille Adobe-style */}
        <BrandingGrid />

        {/* Storybook des composants phares */}
        <div className="mt-24">
          <ComponentStories />
        </div>
      </div>
    </main>
  );
}

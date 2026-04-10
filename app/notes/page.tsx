import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Notes — Vincent Hirtz",
  description:
    "Articles longs autour du métier de Lead Developer Front-End : Pulse JS, Vue + Laravel, Cypress en production, et autres retours d'expérience.",
  alternates: { canonical: "https://vincenthirtz.fr/notes" },
  openGraph: {
    type: "website",
    url: "https://vincenthirtz.fr/notes",
    title: "Notes — Vincent Hirtz",
    description:
      "Retours d'expérience et réflexions sur le développement front-end, par Vincent Hirtz.",
    siteName: "Vincent Hirtz",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary",
    title: "Notes — Vincent Hirtz",
    description:
      "Retours d'expérience et réflexions sur le développement front-end.",
    creator: "@vincenthirtz",
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
      name: "Notes",
      item: "https://vincenthirtz.fr/notes",
    },
  ],
};

export default function NotesIndexPage() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="mb-10">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Retour au portfolio
          </Link>
        </nav>

        {/* En-tête */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-accent)]">All</span>
            <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              Notes
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            J'écris pour <span className="italic text-[var(--color-accent)]">penser</span> plus
            clairement.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--fg-muted)]">
            Quelques notes longues sur le métier — frameworks, architecture, tests, leadership.
            Pas de hot takes, juste du retour d'expérience.
          </p>
        </div>

        {/* Liste */}
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/notes/${article.slug}`}
                className="group block py-8 transition-colors"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span
                    className="rounded-full border px-3 py-1 text-[var(--color-accent)]"
                    style={{ borderColor: "var(--color-accent)" }}
                  >
                    {article.category}
                  </span>
                  <span className="text-[var(--fg-muted)]">{article.dateLabel}</span>
                  <span className="text-[var(--fg-dim)]">·</span>
                  <span className="text-[var(--fg-muted)]">{article.readTime}</span>
                </div>
                <h2 className="font-serif text-3xl leading-tight transition-colors group-hover:text-[var(--color-accent)] md:text-4xl">
                  {article.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">{article.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                  Lire l'article{" "}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

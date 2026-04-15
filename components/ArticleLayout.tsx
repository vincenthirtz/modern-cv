import Link from "next/link";
import type { ReactNode } from "react";
import type { ArticleMeta } from "@/lib/articles";
import type { TocHeading } from "@/lib/articles/stats.generated";
import AnimatedText from "./AnimatedText";
import ShareButtons from "./ShareButtons";
import TableOfContents from "./TableOfContents";
import LikeButton from "./LikeButton";
import ReadingProgress from "./ReadingProgress";

interface ArticleLayoutProps {
  article: ArticleMeta;
  /** Contenu rendu côté serveur, passé en children pour rester sérialisable */
  children: ReactNode;
  related?: ArticleMeta[];
  /** Headings extraits au build pour le sommaire (sinon scrape DOM côté client) */
  headings?: TocHeading[];
  /** ReadTime calculé au build (override la valeur statique de meta) */
  readTime?: string;
}

/**
 * Layout commun à tous les articles : header (breadcrumb, méta, titre),
 * barre de progression de lecture, contenu, footer (navigation).
 *
 * Server Component par défaut ; les bouts interactifs sont isolés
 * (ReadingProgress, TableOfContents, LikeButton, ShareButtons).
 */
export default function ArticleLayout({
  article,
  children,
  related = [],
  headings,
  readTime,
}: ArticleLayoutProps) {
  const displayedReadTime = readTime ?? article.readTime;

  return (
    <article className="relative">
      <ReadingProgress />

      {/* Header */}
      <header className="relative pt-32 pb-16 px-6 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Fil d'ariane"
            className="anim-fade-up mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
              Accueil
            </Link>
            <span className="text-[var(--fg-dim)]">/</span>
            <Link href="/notes" className="transition-colors hover:text-[var(--color-accent)]">
              Notes
            </Link>
            <span className="text-[var(--fg-dim)]">/</span>
            <span className="text-[var(--color-accent)] normal-case tracking-normal">
              {article.title}
            </span>
          </nav>

          <div
            className="anim-fade-up mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="rounded-full border px-3 py-1 text-[var(--color-accent)]"
              style={{ borderColor: "var(--color-accent)" }}
            >
              {article.category}
            </span>
            <span className="text-[var(--fg-muted)]">{article.dateLabel}</span>
            {article.updatedAtLabel && (
              <>
                <span className="text-[var(--fg-dim)]">·</span>
                <span className="text-[var(--fg-muted)]">Mis à jour {article.updatedAtLabel}</span>
              </>
            )}
            <span className="text-[var(--fg-dim)]">·</span>
            <span className="text-[var(--fg-muted)]">{displayedReadTime} de lecture</span>
            {article.tags.length > 0 && (
              <>
                <span className="text-[var(--fg-dim)]">·</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-[var(--fg-muted)]"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>

          <AnimatedText
            el="h1"
            text={article.title}
            className="font-serif text-[clamp(2rem,6vw,5rem)] leading-[1.05] tracking-tight"
            splitBy="word"
            staggerChildren={0.04}
          />
        </div>
      </header>

      {/* Contenu + TOC sidebar */}
      <div className="relative px-6 pb-32">
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          <div
            className="anim-fade-up max-w-3xl"
            style={{ animationDelay: "0.3s", animationDuration: "0.6s" }}
          >
            {children}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t px-6 py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full font-serif text-2xl text-[var(--color-accent)]"
                style={{ background: "var(--elevated)", border: "1px solid var(--border-strong)" }}
              >
                VH
              </div>
              <div>
                <div className="font-serif text-xl">Vincent Hirtz</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                  Lead Developer Front-End · Lyon
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LikeButton slug={article.slug} />
              <ShareButtons
                url={`https://vincenthirtz.fr/notes/${article.slug}`}
                title={article.title}
              />
            </div>
          </div>

          {related.length > 0 && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                  D&apos;autres notes
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/notes/${rel.slug}`} className="card group block p-6">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                      {rel.category} · {rel.dateLabel}
                    </div>
                    <h3 className="mt-2 font-serif text-xl leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                      {rel.title}
                    </h3>
                    <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                      Lire →
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import type { ArticleMeta } from "@/lib/articles";
import AnimatedText from "./AnimatedText";
import ShareButtons from "./ShareButtons";
import TableOfContents from "./TableOfContents";
import LikeButton from "./LikeButton";

interface ArticleLayoutProps {
  article: ArticleMeta;
  /** Contenu rendu côté serveur, passé en children pour rester sérialisable */
  children: ReactNode;
  related?: ArticleMeta[];
}

/**
 * Layout commun à tous les articles : header (breadcrumb, méta, titre),
 * barre de progression de lecture, contenu, footer (navigation).
 *
 * Le contenu est passé en `children` (et non en prop function) pour respecter
 * la frontière Server Component → Client Component de Next 15.
 */
export default function ArticleLayout({ article, children, related = [] }: ArticleLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });

  return (
    <article className="relative">
      {/* Barre de progression de lecture */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(to right, var(--color-accent), var(--color-accent-soft))",
        }}
      />

      {/* Header */}
      <header className="relative pt-32 pb-16 px-6 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Fil d'ariane"
            className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
              ← Retour
            </Link>
            <span className="text-[var(--fg-dim)]">/</span>
            <Link href="/notes" className="transition-colors hover:text-[var(--color-accent)]">
              Notes
            </Link>
          </motion.nav>

          {/* Méta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          >
            <span
              className="rounded-full border px-3 py-1 text-[var(--color-accent)]"
              style={{ borderColor: "var(--color-accent)" }}
            >
              {article.category}
            </span>
            <span className="text-[var(--fg-muted)]">{article.dateLabel}</span>
            <span className="text-[var(--fg-dim)]">·</span>
            <span className="text-[var(--fg-muted)]">{article.readTime} de lecture</span>
          </motion.div>

          {/* Titre animé */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl"
          >
            {children}
          </motion.div>

          {/* Sidebar TOC — visible uniquement sur grand écran */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer : signature + autres notes */}
      <footer className="relative border-t px-6 py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl">
          {/* Signature + like + partage */}
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

          {/* Articles liés */}
          {related.length > 0 && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                  D'autres notes
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

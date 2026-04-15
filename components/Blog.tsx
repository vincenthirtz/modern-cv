"use client";

import Link from "next/link";
import SectionTitle from "./SectionTitle";
import useInViewCSS from "./useInViewCSS";
import { ARTICLES } from "@/lib/articles";

/**
 * Section "Notes" du portfolio. Affiche les 3 derniers articles sous forme
 * de cards cliquables vers /notes/[slug]. Source de vérité : lib/articles.
 *
 * Animations CSS natives avec stagger via animation-delay.
 */
export default function Blog() {
  const articles = ARTICLES.slice(0, 3);
  const { ref, inView } = useInViewCSS({ amount: 0.2 });
  const { ref: linkRef, inView: linkInView } = useInViewCSS({ amount: 0.5 });

  return (
    <section id="blog" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="06"
          label="Écrits"
          title="J'écris pour penser plus clairement."
          highlight="penser"
          description="Quelques notes longues sur le métier. Pas de hot takes — juste du retour d'expérience."
          bigSymbol="/**"
        />

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <div
              key={article.slug}
              className={inView ? "anim-fade-up" : ""}
              style={{
                opacity: inView ? undefined : 0,
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.7s",
              }}
            >
              <Link
                href={`/notes/${article.slug}`}
                className="card group flex h-full flex-col p-7"
                aria-label={`Lire l'article : ${article.title}`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]"
                    style={{ borderColor: "var(--color-accent)" }}
                  >
                    {article.category}
                  </span>
                  <time
                    dateTime={article.date}
                    className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]"
                  >
                    {article.dateLabel}
                  </time>
                </div>
                <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                  {article.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {article.excerpt}
                </p>
                <div
                  className="mt-6 flex items-center justify-between border-t pt-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                    {article.readTime} de lecture
                  </span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Lien vers l'index complet */}
        <div
          ref={linkRef}
          className={`mt-12 flex justify-center ${linkInView ? "anim-fade-up" : ""}`}
          style={{
            opacity: linkInView ? undefined : 0,
            animationDelay: "0.4s",
          }}
        >
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            Toutes les notes
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

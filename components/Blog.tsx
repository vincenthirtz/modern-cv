"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { ARTICLES } from "@/lib/articles";

/**
 * Section "Notes" du portfolio. Affiche les 3 derniers articles sous forme
 * de cards cliquables vers /notes/[slug]. Source de vérité : lib/articles.
 */
export default function Blog() {
  // On affiche les 3 plus récents dans la home
  const articles = ARTICLES.slice(0, 3);

  return (
    <section id="blog" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="06"
          label="Écrits"
          title="J'écris pour penser plus clairement."
          highlight="penser"
          description="Quelques notes longues sur le métier. Pas de hot takes — juste du retour d'expérience."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {articles.map((article) => (
            <motion.div
              key={article.slug}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
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
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                    {article.dateLabel}
                  </span>
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
            </motion.div>
          ))}
        </motion.div>

        {/* Lien vers l'index complet */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            Toutes les notes
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

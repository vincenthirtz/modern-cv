"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import type { ArticleMeta } from "@/lib/articles";

interface NotesFiltersProps {
  articles: ArticleMeta[];
  /** Map slug → texte plein des articles, utilisé pour l'index Fuse full-text. */
  searchIndex?: Record<string, string>;
}

/** Article enrichi du texte plein pour l'indexation Fuse. */
type IndexedArticle = ArticleMeta & { body?: string };

/**
 * Composant client pour filtrer et rechercher les articles.
 * Filtrage par catégorie + recherche full-text via Fuse.js (titre, excerpt,
 * catégorie, tags, et contenu complet de l'article).
 */
export default function NotesFilters({ articles, searchIndex }: NotesFiltersProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extraire les catégories uniques
  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category))].sort(),
    [articles],
  );

  // Extraire les tags uniques
  const allTags = useMemo(() => [...new Set(articles.flatMap((a) => a.tags))].sort(), [articles]);

  // Index Fuse.js pour la recherche — inclut le contenu complet de l'article
  // quand searchIndex est fourni (poids faible pour ne pas dominer le titre).
  const fuse = useMemo(() => {
    const indexed: IndexedArticle[] = articles.map((a) => ({
      ...a,
      body: searchIndex?.[a.slug],
    }));
    return new Fuse(indexed, {
      keys: [
        { name: "title", weight: 0.3 },
        { name: "excerpt", weight: 0.2 },
        { name: "category", weight: 0.12 },
        { name: "tags", weight: 0.12 },
        { name: "dateLabel", weight: 0.06 },
        { name: "body", weight: 0.2 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 3,
    });
  }, [articles, searchIndex]);

  // Filtrage combiné : catégorie + recherche
  const filtered = useMemo(() => {
    let results = articles;

    // Filtre par catégorie
    if (activeCategory) {
      results = results.filter((a) => a.category === activeCategory);
    }

    // Filtre par tag
    if (activeTag) {
      results = results.filter((a) => a.tags.includes(activeTag));
    }

    // Recherche full-text
    if (query.trim()) {
      const fuseResults = fuse.search(query);
      const slugs = new Set(fuseResults.map((r) => r.item.slug));
      results = results.filter((a) => slugs.has(a.slug));
    }

    return results;
  }, [articles, activeCategory, activeTag, query, fuse]);

  return (
    <>
      {/* Barre de recherche + filtres */}
      <div className="mb-12 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-dim)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article..."
            aria-label="Rechercher dans les articles"
            className="w-full rounded-xl border bg-transparent py-3 pl-11 pr-4 font-mono text-sm text-[var(--fg)] placeholder:text-[var(--fg-dim)] focus:border-[var(--color-accent)] focus:outline-none"
            style={{ borderColor: "var(--border-strong)" }}
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-widest transition-colors ${
              activeCategory === null
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "text-[var(--fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }`}
            style={{
              borderColor: activeCategory === null ? "var(--color-accent)" : "var(--border-strong)",
            }}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-widest transition-colors ${
                activeCategory === cat
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "text-[var(--fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
              style={{
                borderColor:
                  activeCategory === cat ? "var(--color-accent)" : "var(--border-strong)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtres par tag */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
              Tags
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] tracking-wide transition-colors ${
                  activeTag === tag
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "text-[var(--fg-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
                style={{
                  borderColor: activeTag === tag ? "var(--color-accent)" : "var(--border)",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-2xl text-[var(--fg-muted)]">Aucun article trouvé.</p>
          <p className="mt-2 text-sm text-[var(--fg-dim)]">
            Essayez un autre terme ou retirez le filtre.
          </p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/notes/${article.slug}`}
                className="group grid gap-6 py-8 transition-colors sm:grid-cols-[220px_1fr]"
              >
                {article.cover ? (
                  <div
                    className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-[var(--elevated)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <Image
                      src={article.cover}
                      alt={article.coverAlt ?? article.title}
                      fill
                      sizes="(min-width: 640px) 220px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="hidden sm:block" aria-hidden />
                )}
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.2em]">
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
                  {article.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-2 py-0.5 font-mono text-[0.625rem] tracking-wide text-[var(--fg-dim)]"
                          style={{ borderColor: "var(--border)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
                    Lire l&apos;article{" "}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Compteur de résultats */}
      {(query || activeCategory || activeTag) && filtered.length > 0 && (
        <div className="mt-6 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
          {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import type { TocHeading } from "@/lib/articles/stats.generated";

interface Props {
  /** Headings extraits au build (préférable). Si absent, fallback DOM scraping. */
  headings?: TocHeading[];
}

/**
 * Table des matières sticky.
 *
 * Mode pré-rendu : reçoit les headings du build (slug + texte + level)
 * et applique l'id correspondant aux <h2>/<h3> au mount, puis observe
 * pour le highlight actif. Évite le scraping client systématique.
 */
export default function TableOfContents({ headings: provided }: Props) {
  const [headings, setHeadings] = useState<TocHeading[]>(provided ?? []);
  const [activeId, setActiveId] = useState<string>("");

  // Synchroniser les ids du DOM avec ceux du build (les MDX ne posent pas d'id natifs).
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    if (provided && provided.length > 0) {
      const els = article.querySelectorAll("h2, h3");
      let i = 0;
      els.forEach((el) => {
        const expected = provided[i];
        if (!expected) return;
        const expectedLevel = el.tagName === "H2" ? 2 : 3;
        if (expectedLevel !== expected.level) return;
        if (!el.id) el.id = expected.id;
        i++;
      });
      return;
    }

    // Fallback : scrape si aucune donnée build n'est passée
    const els = article.querySelectorAll("h2, h3");
    const items: TocHeading[] = [];
    els.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
      items.push({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setHeadings(items);
  }, [provided]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table des matières" className="toc-nav">
      <div className="mb-3 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
        Sommaire
      </div>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              aria-current={activeId === id ? "location" : undefined}
              className={`toc-link ${level === 3 ? "toc-link--h3" : ""} ${
                activeId === id ? "toc-link--active" : ""
              }`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

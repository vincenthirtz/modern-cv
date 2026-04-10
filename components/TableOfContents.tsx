"use client";

import { useEffect, useState, useCallback } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Table des matières sticky qui extrait automatiquement les headings (h2, h3)
 * du contenu de l'article et highlight le heading actif au scroll.
 *
 * Fonctionne par introspection DOM plutôt que par props pour rester
 * compatible avec le rendu MDX côté serveur.
 */
export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extraire les headings au mount
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((el, i) => {
      // Générer un id si absent
      if (!el.id) {
        el.id = `heading-${i}`;
      }
      items.push({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  // Observer les headings pour le highlight actif
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trouver le premier heading visible en partant du haut
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table des matières" className="toc-nav">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
        Sommaire
      </div>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
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

"use client";

import { useState, type ReactNode } from "react";
import { Highlighted, type CodeLang } from "@/lib/syntax-highlight";

export interface StoryProps {
  name: string;
  description: string;
  /** Snippet d'usage (JSX) */
  code: string;
  /** Implémentation interne (JSX) */
  source: string;
  /** Styles CSS associés */
  css: string;
  /** Démo interactive */
  children: ReactNode;
  /** Hauteur minimale du canvas de démo */
  minH?: string;
}

type Tab = "preview" | "code" | "source" | "css";

const TABS: { id: Tab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Usage" },
  { id: "source", label: "Core" },
  { id: "css", label: "CSS" },
];

/**
 * Coquille d'une "story" du Storybook : preview, snippet d'usage,
 * implémentation interne, CSS — avec onglets et bouton copier.
 */
export default function Story({
  name,
  description,
  code,
  source,
  css,
  children,
  minH = "min-h-[180px]",
}: StoryProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const currentSnippet = tab === "source" ? source : tab === "css" ? css : code;
  const currentLang: CodeLang = tab === "css" ? "css" : "jsx";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible (HTTP, perms…) */
    }
  }

  return (
    <article
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
    >
      <header
        className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">
              {name}
            </h3>
          </div>
          <p className="mt-1 text-[13px] text-[var(--fg-muted)]">{description}</p>
        </div>
        <div
          className="inline-flex rounded-lg border p-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ borderColor: "var(--border-strong)", background: "var(--ink-soft)" }}
          role="tablist"
          aria-label={`Vue ${name}`}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className="rounded-md px-3 py-1 transition-colors"
              style={{
                background: tab === t.id ? "var(--color-accent)" : "transparent",
                color: tab === t.id ? "var(--color-accent-contrast)" : "var(--fg-muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {tab === "preview" ? (
        <div
          className={`relative flex ${minH} items-center justify-center p-8`}
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent 0 12px, var(--border) 12px 13px), var(--ink-soft)",
          }}
        >
          <div className="relative z-10 w-full">{children}</div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={handleCopy}
            aria-label={copied ? "Code copié" : "Copier le code"}
            className="absolute right-3 top-3 z-10 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--elevated)",
              color: copied ? "var(--color-accent)" : "var(--fg-muted)",
            }}
          >
            {copied ? "Copié" : "Copier"}
          </button>
          <pre
            className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed"
            style={{ background: "var(--ink)", color: "var(--fg-muted)" }}
          >
            <code>
              <Highlighted code={currentSnippet} lang={currentLang} />
            </code>
          </pre>
        </div>
      )}
    </article>
  );
}

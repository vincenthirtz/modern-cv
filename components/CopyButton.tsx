"use client";

import { useState, useCallback } from "react";

/**
 * Bouton "copier" pour les blocs de code.
 * Affiche une icone clipboard, puis une coche pendant 2 s après copie.
 */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencieux
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Code copié" : "Copier le code"}
      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100"
      style={{
        borderColor: "var(--border-strong)",
        background: "var(--elevated)",
        color: copied ? "var(--color-accent)" : "var(--fg-muted)",
      }}
    >
      {copied ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

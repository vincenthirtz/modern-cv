"use client";

import { useState, useEffect, useCallback } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

/**
 * Boutons de partage : Web Share API natif (mobile/desktop compatible),
 * puis Twitter/X, LinkedIn, copier le lien en fallback.
 */
export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const nativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Utilisateur a annulé le partage
    }
  }, [title, url]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencieux
    }
  }, [url]);

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
        Partager
      </span>

      {/* Web Share API natif */}
      {canNativeShare && (
        <button
          onClick={nativeShare}
          aria-label="Partager cet article"
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          style={{ borderColor: "var(--border-strong)", color: "var(--fg-muted)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      )}

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur Twitter"
        className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        style={{ borderColor: "var(--border-strong)", color: "var(--fg-muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        style={{ borderColor: "var(--border-strong)", color: "var(--fg-muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>

      {/* Copier le lien */}
      <button
        onClick={copyLink}
        aria-label={copied ? "Lien copié" : "Copier le lien"}
        className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        style={{
          borderColor: "var(--border-strong)",
          color: copied ? "var(--color-accent)" : "var(--fg-muted)",
        }}
      >
        {copied ? (
          <svg
            width="16"
            height="16"
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  );
}

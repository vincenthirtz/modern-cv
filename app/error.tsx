"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary global pour l'App Router.
 * Capture les erreurs côté client et affiche un fallback.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <main
      id="main"
      className="relative z-[2] flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="mb-4 font-serif text-4xl tracking-tight md:text-5xl">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="mb-8 max-w-md text-[var(--fg-muted)]">
        Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir à l&apos;accueil.
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-[11px] text-[var(--fg-dim)]">
          Référence : {error.digest}
        </p>
      )}
      <div className="flex gap-4">
        <button onClick={reset} className="btn-accent rounded-full px-6 py-3 text-sm font-medium">
          Réessayer
        </button>
        {/* <a> intentionnel : le router client peut être cassé dans un Error Boundary */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="btn-ghost rounded-full px-6 py-3 text-sm font-medium">
          Retour à l&apos;accueil
        </a>
      </div>
    </main>
  );
}

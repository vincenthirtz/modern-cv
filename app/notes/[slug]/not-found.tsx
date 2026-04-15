import Link from "next/link";

/**
 * Page affichée quand un slug d'article n'existe pas.
 * Plus contextualisée que la 404 globale : propose de revenir aux notes.
 */
export default function ArticleNotFound() {
  return (
    <main className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Label */}
      <div className="mb-8 flex items-center gap-3">
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Article introuvable
        </span>
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
      </div>

      {/* Titre */}
      <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] leading-tight">
        Cette note n&apos;existe{" "}
        <span className="italic text-[var(--color-accent)]">pas encore</span>.
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-md text-[var(--fg-muted)]">
        Le slug demandé ne correspond à aucun article publié. Il a peut-être été renommé ou retiré.
      </p>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/notes" className="btn-accent">
          Voir toutes les notes
        </Link>
        <Link href="/" className="btn-ghost">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

"use client";

/**
 * Bouton d'impression isolé en Client Component minimal pour permettre
 * à la page CV de rester un Server Component.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="rounded-full border bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-ink)] transition-transform hover:scale-105"
      style={{ borderColor: "var(--color-accent)" }}
    >
      Imprimer
    </button>
  );
}

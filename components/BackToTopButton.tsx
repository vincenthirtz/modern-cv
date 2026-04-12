"use client";

export default function BackToTopButton() {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Retour en haut de la page"
      className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      style={{ borderColor: "var(--border-strong)" }}
    >
      Retour en haut
      <span
        aria-hidden="true"
        className="inline-block transition-transform group-hover:-translate-y-0.5"
      >
        &uarr;
      </span>
    </button>
  );
}

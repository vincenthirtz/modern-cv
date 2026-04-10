/**
 * Skeleton minimaliste affiché pendant le chargement / la navigation.
 * Reprend les couleurs du theme pour éviter tout flash.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="flex items-center gap-3">
        <span
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Loading
        </span>
      </div>
    </div>
  );
}

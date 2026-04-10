/**
 * Skeleton de chargement pour la liste des articles.
 */
export default function NotesLoading() {
  return (
    <main className="relative z-[2] px-6 pt-32 pb-32 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="skeleton mb-10 h-3 w-32" />

        {/* En-tete */}
        <div className="mb-16 max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton h-3 w-8" />
            <div className="skeleton h-[1px] w-10" />
            <div className="skeleton h-3 w-12" />
          </div>
          <div className="skeleton h-14 w-3/4 rounded-xl" />
          <div className="skeleton h-5 w-full max-w-xl" />
        </div>

        {/* Liste d'articles */}
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-3 w-16" />
              </div>
              <div className="skeleton h-9 w-2/3 rounded-lg" />
              <div className="skeleton h-4 w-full max-w-2xl" />
              <div className="skeleton h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

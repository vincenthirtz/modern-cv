/**
 * Skeleton de chargement pour la page CV.
 */
export default function CVLoading() {
  return (
    <main className="relative z-[2] min-h-screen px-6 py-12">
      {/* Barre d'actions */}
      <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <div className="skeleton h-3 w-32" />
        <div className="flex gap-2">
          <div className="skeleton h-10 w-32 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </div>

      {/* CV */}
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="skeleton h-10 w-64 rounded-lg" />
          <div className="skeleton h-5 w-48" />
        </div>

        {/* Profil */}
        <div className="space-y-3">
          <div className="skeleton h-6 w-48 rounded-lg" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-4/5" />
        </div>

        {/* Competences */}
        <div className="space-y-3">
          <div className="skeleton h-6 w-52 rounded-lg" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-3 w-28" />
                <div className="skeleton h-3 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <div className="skeleton h-6 w-56 rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-5 w-48" />
                <div className="skeleton h-4 w-32" />
              </div>
              <div className="skeleton h-3 w-36" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-11/12" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/**
 * Skeleton de chargement pour la page d'accueil.
 * Affiché par Next.js pendant le rendu serveur de page.tsx.
 */
export default function HomeLoading() {
  return (
    <main className="relative z-[2]" role="status" aria-label="Chargement">
      {/* Hero skeleton */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="skeleton mx-auto h-4 w-40" />
          <div className="skeleton mx-auto h-16 w-3/4 rounded-xl" />
          <div className="skeleton mx-auto h-16 w-1/2 rounded-xl" />
          <div className="skeleton mx-auto mt-8 h-5 w-96 max-w-full" />
          <div className="mt-10 flex justify-center gap-4">
            <div className="skeleton h-12 w-40 rounded-full" />
            <div className="skeleton h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}

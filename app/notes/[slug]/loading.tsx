/**
 * Skeleton de chargement pour un article individuel.
 */
export default function ArticleLoading() {
  return (
    <main className="relative z-[2]">
      {/* Header */}
      <header className="relative pt-32 pb-16 px-6 sm:pt-40">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-3 w-4" />
            <div className="skeleton h-3 w-12" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-3 w-20" />
          </div>

          {/* Titre */}
          <div className="space-y-3">
            <div className="skeleton h-12 w-4/5 rounded-xl" />
            <div className="skeleton h-12 w-2/3 rounded-xl" />
          </div>
        </div>
      </header>

      {/* Contenu */}
      <div className="relative px-6 pb-32">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-11/12" />
          <div className="skeleton h-5 w-4/5" />
          <div className="skeleton mt-10 h-8 w-1/2 rounded-lg" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-10/12" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton mt-8 h-40 w-full rounded-2xl" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-5/6" />
        </div>
      </div>
    </main>
  );
}

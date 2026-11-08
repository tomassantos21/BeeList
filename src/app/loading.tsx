export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-64 bg-neutral-900 rounded-xl mb-4" />
      <div className="h-4 w-96 bg-neutral-900/60 rounded-lg mb-8" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-900 bg-neutral-900/40 overflow-hidden"
          >
            <div className="aspect-[16/10] bg-neutral-800/50" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              <div className="h-3 bg-neutral-800/60 rounded w-1/3" />
              <div className="h-9 bg-neutral-800/40 rounded-xl mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[28px] border border-border bg-card">
          <div className="aspect-[16/10] animate-pulse bg-secondary" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-full animate-pulse rounded bg-secondary" />
            <div className="h-16 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

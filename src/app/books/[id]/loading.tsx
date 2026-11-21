/** Loading skeleton for the Book Details page (shown while navigation loads). */
export default function BookDetailsLoading() {
  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-5 w-1/4 rounded-full bg-muted animate-pulse" />
        <div className="h-9 w-3/4 rounded-xl bg-muted animate-pulse" />
        <div className="h-5 w-1/3 rounded-full bg-muted animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
          <div className="aspect-[5/7] rounded-xl bg-muted animate-pulse" />
          <div className="space-y-4 pt-2">
            <div className="h-5 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-2/3 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded-md bg-muted animate-pulse" />
            <div className="h-20 w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

/**
 * Loading skeleton matching the new BookCard structure (fixed image area,
 * badge/title/author/panel/description/button bars) — used by the loading
 * states of the home Latest Arrivals section, the All Books page and
 * My Books page.
 */
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-[580px] rounded-2xl border border-border/80 bg-card overflow-hidden animate-pulse">
      <div className="h-[240px] sm:h-[260px] w-full border-b border-border/60 bg-muted/40" />
      <div className="flex-1 px-5 pt-5 pb-5 sm:px-6 space-y-3">
        <div className="h-5 w-28 rounded-md bg-muted" />
        <div className="h-6 w-4/5 rounded-md bg-muted" />
        <div className="h-4 w-2/5 rounded-md bg-muted/80" />
        <div className="h-16 w-full rounded-lg bg-muted/50" />
        <div className="h-3 w-full rounded-md bg-muted/60" />
        <div className="h-9 w-full rounded-md bg-muted/40 mt-auto" />
      </div>
    </div>
  );
}

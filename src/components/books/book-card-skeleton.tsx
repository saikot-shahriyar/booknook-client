import React from "react";

/**
 * Loading skeleton matching the new BookCard structure (fixed image area,
 * badge/title/author/panel/description/button bars) — used by the loading
 * states of the home Latest Arrivals section, the All Books page and
 * My Books page.
 */
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-[480px] rounded-2xl border border-border/80 bg-card overflow-hidden animate-pulse">
      <div className="h-[168px] sm:h-[190px] w-full border-b border-border/60 bg-muted/40" />
      <div className="flex-1 px-4 pt-3 pb-4 space-y-2">
        <div className="h-5 w-28 rounded-md bg-muted" />
        <div className="h-6 w-4/5 rounded-md bg-muted" />
        <div className="h-4 w-2/5 rounded-md bg-muted/80" />
        <div className="h-16 w-full rounded-lg bg-muted/50" />
        <div className="h-3 w-full rounded-md bg-muted/60" />
        <div className="h-7 w-full rounded-md bg-muted/40 mt-auto" />
      </div>
    </div>
  );
}

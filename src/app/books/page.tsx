import { Suspense } from "react";
import type { Metadata } from "next";
import { BooksExplorer } from "@/components/books/books-explorer";

export const metadata: Metadata = {
  title: {
    absolute: "BookNook | All Books",
  },
  description:
    "Browse and explore the full collection of books in the BookNook library. Filter by genre, check copy availability, and borrow with ease.",
};

function BooksPageSkeleton() {
  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-4 border-b border-border/70 pb-8 animate-pulse">
          <div className="h-6 w-36 rounded-full bg-muted" />
          <div className="h-10 w-72 rounded-md bg-muted" />
          <div className="h-4 w-96 rounded-md bg-muted/70" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[460px] rounded-2xl border border-border/60 bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksPageSkeleton />}>
      <BooksExplorer />
    </Suspense>
  );
}

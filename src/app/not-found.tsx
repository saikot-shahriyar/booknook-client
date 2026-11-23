import { ArrowRight, BookOpen, Library, Search } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Not Found",
  description:
    "The page you're looking for could not be found. Head back home or browse the full catalog of books.",
};

export default function NotFound() {
  return (
    <section className="w-full py-16 sm:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-7 text-center">
        {/* 404 indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Search className="size-3.5" />
          <span>404</span>
        </div>

        {/* Page title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
          Page Not Found
        </h1>

        {/* Helpful message */}
        <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          The page you&apos;re looking for could not be found. It may have been
          moved or removed. Head back home or browse the full catalog of books.
        </p>

        {/* Navigation actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full justify-center gap-2 shadow-xs sm:w-auto"
            )}
          >
            <BookOpen className="size-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full justify-center gap-2 sm:w-auto"
            )}
          >
            <Library className="size-4" />
            <span>Browse Books</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Helpful hint for direct navigation */}
        <p className="max-w-xl text-sm text-muted-foreground/80">
          Use the navigation above to find what you need, or try searching for
          the title you were looking for.
        </p>
      </div>
    </section>
  );
}

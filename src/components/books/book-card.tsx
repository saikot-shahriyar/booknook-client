import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, User, CheckCircle2, XCircle } from "lucide-react";
import { Book } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Category badge colors
const categoryBadgeStyles: Record<string, string> = {
  Fiction: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  Science: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  History: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  Kids: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Others: "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
};

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const bookId = book._id || "";
  const isAvailable = book.availableCopies > 0;
  const badgeStyle =
    categoryBadgeStyles[book.category] || categoryBadgeStyles["Others"];

  return (
    <article className="flex flex-col h-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden group">
      {/* Book Cover Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/50">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-muted-foreground/60">
            <BookOpen className="size-12 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs",
              badgeStyle
            )}
          >
            {book.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md shadow-xs border",
              isAvailable
                ? "bg-background/90 text-emerald-700 dark:text-emerald-400 border-emerald-300/40"
                : "bg-background/90 text-rose-700 dark:text-rose-400 border-rose-300/40"
            )}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>{book.availableCopies} Copies Available</span>
              </>
            ) : (
              <>
                <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
                <span>Out of Stock</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Book Details Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {/* Short Description */}
        {book.description && (
          <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Bottom Action */}
        <div className="mt-auto pt-3 border-t border-border/60">
          <Link
            href={`/books/${bookId}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-medium"
            )}
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

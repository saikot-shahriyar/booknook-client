import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, User } from "lucide-react";
import { Book } from "@/types";
import { CATEGORY_STYLES } from "@/components/books/category-styles";
import { BookCopiesPanel } from "@/components/books/copies-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Category badge classes (literal, shared via CATEGORY_STYLES) — exported
 * for reuse by other book views (e.g. details page). Dark mode uses a
 * tinted background with white text for readability.
 */
export const categoryBadgeStyles: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_STYLES).map(
    ([category, style]): [string, string] => [category, style.badge]
  )
);

/** Shared, controlled image area of the book cards (fits the grid + padding). */
export const BOOK_CARD_IMAGE_CLASSES =
  "relative w-full h-[168px] sm:h-[190px] overflow-hidden bg-muted/40 border-b border-border/60";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const bookId = book._id || "";
  const badgeStyle =
    categoryBadgeStyles[book.category] || categoryBadgeStyles["Others"];

  return (
    <article className="flex flex-col h-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden group">
      {/* A. Book cover — fixed-height area, object-contain, subtle neutral bg. */}
      <div className={BOOK_CARD_IMAGE_CLASSES}>
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground/60">
            <BookOpen className="size-10 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}
      </div>

      {/* B/C/D/E/F — content area */}
      <div className="flex flex-col flex-1 gap-2 px-4 pb-4">
        {/* B. Category pill badge — below the image, inside the content. */}
        <span
          className={cn(
            "inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            badgeStyle
          )}
        >
          {book.category}
        </span>

        {/* C. Book title (prominent) and author (directly below). */}
        <h3 className="text-base font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {/* D. Copies information panel. */}
        <BookCopiesPanel book={book} />

        {/* E. Short description — compact, bounded to ~3 lines. */}
        {book.description && (
          <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* F. View Details — full-width primary button, aligned at the bottom. */}
        <Link
          href={`/books/${bookId}`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "w-full font-medium mt-auto"
          )}
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

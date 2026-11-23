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
 * for reuse by other book views (e.g. details page). Each badge uses its
 * category color on a light tinted background.
 */
export const categoryBadgeStyles: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_STYLES).map(
    ([category, style]): [string, string] => [category, style.badge]
  )
);

/** Shared, controlled image area of the book cards (fits the grid + padding). */
export const BOOK_CARD_IMAGE_CLASSES =
  "relative w-full h-[240px] sm:h-[260px] overflow-hidden bg-muted/40 border-b border-border/60";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const bookId = book._id || "";
  const badgeStyle =
    categoryBadgeStyles[book.category] || categoryBadgeStyles["Others"];

  return (
    <article className="flex flex-col h-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:inset-ring-[2.5px] hover:inset-ring-[#111827] overflow-hidden group">
      {/* A. Book cover — fixed-height area, object-cover, centered, subtle neutral bg. */}
      <div className={BOOK_CARD_IMAGE_CLASSES}>
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground/60">
            <BookOpen className="size-10 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}
        {/* B. Category badge — overlaid on the cover near the top-left corner. */}
        <span
          className={cn(
            "absolute left-3 top-3 z-10 inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm ring-2 ring-[#FFFFFF]/15 ring-offset-1",
            badgeStyle
          )}
        >
          {book.category}
        </span>
      </div>

      {/* C/D/E/F — content area */}
      <div className="flex flex-col flex-1 gap-3 px-5 pt-5 pb-5 sm:px-6">
        {/* C. Book title (prominent) and author (directly below). */}
        <h3 className="text-base font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0 text-[#2563EB]" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {/* D. Copies information panel. */}
        <BookCopiesPanel book={book} />

        {/* E. Short description — compact, bounded to ~3 lines. */}
        {book.description && (
          <p className="text-sm leading-relaxed line-clamp-3 text-[#27272A]">
            {book.description}
          </p>
        )}

        {/* F. View Details — larger full-width primary button, aligned at the bottom. */}
        <Link
          href={`/books/${bookId}`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-md w-full font-semibold mt-auto bg-[#111827] text-white hover:bg-[#111827]/90"
          )}
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

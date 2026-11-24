import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Building2, CalendarClock, BookOpen, AlertCircle, User } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { getBookById, ApiError } from "@/lib/api";
import { categoryBadgeStyles } from "@/components/books/book-card";
import { getStatusStyle } from "@/components/books/status-styles";
import { BorrowButton } from "@/components/books/borrow-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Book } from "@/types";

// Opt out of instant/static prerender — this route needs runtime data (params + session)
export const instant = false;

export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  let title: string = "Not Found";
  let description: string =
    "The page you're looking for could not be found. Head back home or browse the full catalog of books.";

  try {
    const response = await getBookById(id);
    const book = response?.data ?? null;
    if (book && book.title) {
      title = book.title;
      if (book.description) {
        description = book.description;
      }
    }
  } catch {
    // Book not found or backend error: keep the generic title/description.
  }

  return { title, description };
}

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

/** Formats an ISO date string for display, or null when absent/invalid. */
function formatAddedDate(iso?: string): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params;
  await requireAuth(`/books/${id}`);

  let book: Book | null = null;
  let error: string | null = null;

  try {
    const response = await getBookById(id);
    book = response?.data ?? null;
  } catch (err) {
    // A missing (or malformed) book ID means there is no book with this ID.
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    error =
      err instanceof Error && err.message
        ? err.message
        : "Failed to load book details. Please try again later.";
  }

  const badgeStyle =
    (book && categoryBadgeStyles[book.category]) || categoryBadgeStyles["Others"];
  const addedDate = book ? formatAddedDate(book.createdAt) : null;

  return (
    <ProtectedRoute>
      <div className="w-full">
        {/* Back to catalog */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 font-medium cursor-pointer"
            )}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Error state (e.g. backend unreachable) */}
        {error && (
          <div className="w-full py-10 sm:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
                <AlertCircle className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Unable to Load Book Details</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/books"
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "gap-2 font-medium"
                  )}
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Book details */}
        {!error && book && (
          <div className="w-full py-10 sm:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 md:gap-6 items-start rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
                {/* Left column: cover image — reduced size, vertically centered */}
                <div className="relative aspect-[5/7] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-muted/50">
                  {book.image ? (
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
                      <BookOpen className="size-10" />
                      <span className="text-xs font-medium">Cover Not Available</span>
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute top-3 left-3",
                      getStatusStyle(book.availableCopies > 0 ? "Available" : "Out of Stock").badge
                    )}
                  >
                    {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* Right column: details — scans quickly on a balanced layout */}
                <div className="flex flex-col gap-4 p-5 md:p-7">
                  <div className="space-y-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                        badgeStyle
                      )}
                    >
                      {book.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {book.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      {book.author}
                    </span>
                    {book.userName && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-3.5" />
                        Added by {book.userName}
                      </span>
                    )}
                    {addedDate && (
                      <span className="flex items-center gap-1.5">
                        <CalendarClock className="size-3.5" />
                        Added {addedDate}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-border/60">
                    <div className="rounded-xl bg-muted/40 p-3 flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Copies
                      </span>
                      <span className="text-lg font-bold text-foreground">{book.totalCopies}</span>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3 flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Available Copies
                      </span>
                      <span className="text-lg font-bold text-foreground">{book.availableCopies}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground/90 leading-relaxed">
                    {book.description || "No description available."}
                  </p>

                  {/* Borrow action */}
                  <BorrowButton book={book} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Inbox,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getMyBooks } from "@/lib/api";
import { Book } from "@/types";
import { MyBookItem } from "@/components/books/my-book-item";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Client component that lists the books added by the signed-in user
 * (`GET /books?userEmail=...`). Shows loading, error and empty states.
 */
export function MyBooksList() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    const result = await getMyBooks(userEmail);
    if (result.error) {
      setError(result.error);
      setBooks([]);
    } else {
      setBooks(result.books);
      setError(null);
    }
    setIsLoading(false);
  }, [userEmail]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!isCancelled) {
        await fetchBooks();
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [fetchBooks, userEmail]);

  /** Refresh the list after a successful edit. */
  const handleBookEdited = useCallback(async () => {
    await fetchBooks();
  }, [fetchBooks]);

  /** Remove the book from the list after a successful delete. */
  const handleBookDeleted = useCallback((bookId: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
  }, []);

  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="border-b border-border/70 pb-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <BookOpen className="size-3.5" />
            <span>Your Library Shelf</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                My Books
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Books you added to the BookNook library. Edit details, adjust copy counts, or remove titles you no longer need.
              </p>
            </div>
            {!isLoading && !error && books.length > 0 && (
              <div className="text-xs sm:text-sm font-medium text-muted-foreground self-start md:self-auto bg-muted/60 px-3.5 py-1.5 rounded-full border border-border">
                <span className="font-bold text-foreground">{books.length}</span>{" "}
                {books.length === 1 ? "book" : "books"} added by you
              </div>
            )}
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                Could Not Load Your Books
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={fetchBooks}
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "gap-2 font-medium cursor-pointer"
                )}
              >
                <RefreshCw className="size-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <Inbox className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                No Books Added by You Yet
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Books you add through the Add Book page will appear here and can be managed later. Start adding your first title!
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Link
                href="/add-book"
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "gap-2 font-medium"
                )}
              >
                <Plus className="size-4" />
                <span>Add Your First Book</span>
              </Link>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book) => (
              <MyBookItem
                key={book._id || book.title}
                book={book}
                onEdited={handleBookEdited}
                onDeleted={handleBookDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

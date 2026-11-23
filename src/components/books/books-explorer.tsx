"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Filter,
  RefreshCw,
  AlertCircle,
  Inbox,
  BookX,
  Layers,
} from "lucide-react";
import { Book } from "@/types";
import { getAllBooks } from "@/lib/api";
import { BookCard } from "@/components/books/book-card";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";
import { getCategoryStyle } from "@/components/books/category-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export function BooksExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active category derived from URL search param
  const activeCategory = useMemo(() => {
    const cat = searchParams.get("category");
    if (!cat) return "All";
    const found = CATEGORIES.find(
      (c) => c.toLowerCase() === cat.trim().toLowerCase()
    );
    return found || "All";
  }, [searchParams]);

  // Fetch all books
  const fetchAllBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getAllBooks();
    if (result.error) {
      setError(result.error);
      setBooks([]);
    } else {
      setBooks(result.books);
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      const result = await getAllBooks();
      if (!isCancelled) {
        if (result.error) {
          setError(result.error);
          setBooks([]);
        } else {
          setBooks(result.books);
          setError(null);
        }
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Update category filter and reflect in URL
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // Filter books locally by active category
  const filteredBooks = useMemo(() => {
    if (activeCategory === "All") {
      return books;
    }
    return books.filter(
      (b) => b.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [books, activeCategory]);

  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="border-b border-border/70 pb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                Explore Our Library
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Browse our comprehensive catalog of titles, reserve copies, and discover new stories across every genre.
              </p>
            </div>

            {/* Results Counter */}
            {!isLoading && !error && books.length > 0 && (
              <div className="text-xs sm:text-sm font-medium text-muted-foreground self-start md:self-auto bg-muted/60 px-3.5 py-1.5 rounded-full border border-border">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {filteredBooks.length}
                </span>{" "}
                {filteredBooks.length === 1 ? "book" : "books"}
                {activeCategory !== "All" && (
                  <span>
                    {" "}
                    in <span className="font-semibold text-foreground">&ldquo;{activeCategory}&rdquo;</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
            <Filter className="size-3.5" />
            <span>Categories</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              // "All" keeps the neutral primary style; named categories use the shared palette.
              const style = cat === "All" ? null : getCategoryStyle(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border",
                    isActive
                      ? style
                        ? style.pill
                        : "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              );
            })}
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

        {/* API Offline / Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                Library Catalog Service Offline
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unable to retrieve books from the backend server. Please verify that the API server is running on the configured address.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={fetchAllBooks}
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "gap-2 font-medium cursor-pointer"
                )}
              >
                <RefreshCw className="size-4" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        )}

        {/* Database Empty State (Backend alive, but zero books in total) */}
        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <Inbox className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                No Books in the Catalog
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There are currently no books added to the BookNook library collection. Check back soon as new books are cataloged.
              </p>
            </div>
          </div>
        )}

        {/* Category Empty State (Books exist, but none in selected category) */}
        {!isLoading && !error && books.length > 0 && filteredBooks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <BookX className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                No Books Found in &ldquo;{activeCategory}&rdquo;
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There are currently no titles under the {activeCategory} category. Explore other categories or view all books.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => handleCategoryChange("All")}
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "gap-2 font-medium cursor-pointer"
                )}
              >
                <Layers className="size-4" />
                <span>View All Books ({books.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Responsive Books Grid */}
        {!isLoading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book._id || book.title} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

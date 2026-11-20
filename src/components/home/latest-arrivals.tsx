"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Book } from "@/types";
import { getLatestBooks } from "@/lib/api";
import { BookCard } from "@/components/books/book-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LatestArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getLatestBooks(6);
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
      const result = await getLatestBooks(6);
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

  return (
    <section id="latest-arrivals" className="w-full py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3.5" />
              <span>Fresh Off The Press</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Arrivals
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Explore newly added titles in our community collection, sorted by newest additions first.
            </p>
          </div>

          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex items-center gap-2 group self-start sm:self-auto font-medium"
            )}
          >
            <span>See All Books</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col h-[460px] rounded-2xl border border-border/60 bg-card overflow-hidden animate-pulse p-4 space-y-4"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-muted" />
                <div className="space-y-2 flex-1 pt-2">
                  <div className="h-5 w-3/4 rounded-md bg-muted" />
                  <div className="h-4 w-1/2 rounded-md bg-muted/80" />
                  <div className="h-10 w-full rounded-md bg-muted/50 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Error / Offline State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
              <AlertCircle className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                Catalog Service Offline
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The library backend API is currently unreachable. When the backend server is running, the latest arrivals will automatically load here.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={fetchBooks}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "gap-2 font-medium cursor-pointer"
                )}
              >
                <RefreshCw className="size-3.5" />
                <span>Retry Connection</span>
              </button>
              <Link
                href="/books"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "font-medium"
                )}
              >
                <span>Browse Catalog</span>
              </Link>
            </div>
          </div>
        )}

        {/* Empty Catalog State (Connected, but no books) */}
        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <Inbox className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                No Books Available Yet
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our library shelves are currently waiting for their first additions. Stay tuned or explore our book categories below.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/books"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "gap-2 font-medium"
                )}
              >
                <BookOpen className="size-4" />
                <span>Explore Book Categories</span>
              </Link>
            </div>
          </div>
        )}

        {/* Active Books Grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book) => (
              <BookCard key={book._id || book.title} book={book} />
            ))}
          </div>
        )}

        {/* Mobile See All Books button */}
        <div className="text-center sm:hidden pt-2">
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full justify-center gap-2 font-medium"
            )}
          >
            <span>See All Books</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

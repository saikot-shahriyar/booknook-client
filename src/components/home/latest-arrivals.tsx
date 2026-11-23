"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Book } from "@/types";
import { getLatestBooks } from "@/lib/api";
import { BookCard } from "@/components/books/book-card";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LatestArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

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

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await fetchBooks();
    } finally {
      setIsRetrying(false);
    }
  };

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
          <div className="w-full space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Arrivals
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Explore newly added titles in our community collection, sorted by newest additions first.
            </p>
          </div>

        </div>

        {/* Loading indicator — visible while the catalog request is in flight */}
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center gap-3 py-8"
            role="status"
          >
            <Spinner size="size-8" className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Loading books…
            </span>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* API Error / Offline State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
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
                onClick={handleRetry}
                disabled={isRetrying}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "gap-2 font-medium cursor-pointer disabled:opacity-80"
                )}
              >
                {isRetrying ? (
                  <Spinner size="size-4" className="text-white" />
                ) : (
                  <RefreshCw className="size-3.5" />
                )}
                <span>{isRetrying ? "Retrying…" : "Retry Connection"}</span>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {books.map((book) => (
                <BookCard key={book._id || book.title} book={book} />
              ))}
            </div>

            {/* Desktop See All Books — centered below the cards */}
            <div className="flex justify-center pt-8">
              <Link
                href="/books"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "hidden sm:inline-flex items-center gap-2 group rounded-lg px-6 py-3 font-bold text-white bg-[#111827] border-[#FFFFFF]/20 shadow-sm transition-all duration-300 hover:bg-white hover:text-[#111827] hover:border-[#111827] hover:scale-105"
                )}
              >
                <span>See All Books</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}

        {/* Mobile See All Books button */}
        <div className="text-center sm:hidden pt-2">
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white bg-[#111827] border-[#FFFFFF]/20 shadow-sm transition-all duration-300 hover:bg-white hover:text-[#111827] hover:border-[#111827] hover:scale-105"
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

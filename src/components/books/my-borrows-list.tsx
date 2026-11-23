"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, Inbox, RefreshCw } from "lucide-react";
import { getMyBorrows } from "@/lib/api";
import { Borrow } from "@/types";
import { MyBorrowItem } from "@/components/books/my-borrow-item";
import { MyBorrowRow } from "@/components/books/my-borrow-row";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Client component that lists the signed-in user's active borrow records
 * (`GET /borrows` — the backend derives the user from the verified JWT).
 * Shows a desktop table (Book, Borrow Date, Return Date, Status, Actions)
 * and a responsive card grid on small screens, with loading, error and empty
 * states.
 */
export function MyBorrowList() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrows = useCallback(async () => {
    const result = await getMyBorrows();
    if (result.error) {
      setError(result.error);
      setBorrows([]);
    } else {
      setBorrows(result.borrows);
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!isCancelled) {
        await fetchBorrows();
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [fetchBorrows]);

  /** Remove the borrow from the list after a successful return. */
  const handleReturned = useCallback((borrowId: string) => {
    setBorrows((prev) => prev.filter((borrow) => borrow._id !== borrowId));
  }, []);

  const borrowCount = borrows.length;

  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="border-b border-border/70 pb-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <BookOpen className="size-3.5" />
            <span>Your Active Borrows</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                My Borrows
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Books you have borrowed from the BookNook library. Return them
                to make the copies available for others.
              </p>
            </div>
            {!isLoading && !error && borrowCount > 0 && (
              <div className="text-xs sm:text-sm font-medium text-muted-foreground self-start md:self-auto bg-muted/60 px-3.5 py-1.5 rounded-full border border-border">
                <span className="font-bold text-foreground">{borrowCount}</span>{" "}
                {borrowCount === 1 ? "active borrow" : "active borrows"}
              </div>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-6 py-4 animate-pulse"
              >
                <div className="size-12 shrink-0 rounded-xl bg-muted" />
                <div className="h-5 w-1/2 rounded-md bg-muted" />
                <div className="ml-auto h-4 w-1/4 rounded-md bg-muted/80" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                Could Not Load Your Borrows
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={fetchBorrows}
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
        {!isLoading && !error && borrowCount === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <Inbox className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                You Have No Active Borrows
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Books you borrow from the catalog will appear here with their
                due dates, so you can return them on time.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Link
                href="/books"
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "gap-2 font-medium"
                )}
              >
                <BookOpen className="size-4" />
                <span>Browse Books</span>
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && !error && borrowCount > 0 && (
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/80 bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Return Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {borrows.map((borrow) => (
                  <MyBorrowRow
                    key={borrow._id || borrow.bookId}
                    borrow={borrow}
                    onReturned={handleReturned}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card Grid */}
        {!isLoading && !error && borrowCount > 0 && (
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {borrows.map((borrow) => (
              <MyBorrowItem
                key={borrow._id || borrow.bookId}
                borrow={borrow}
                onReturned={handleReturned}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

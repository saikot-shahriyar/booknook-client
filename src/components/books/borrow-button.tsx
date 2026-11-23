"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookCheck, CalendarDays, Loader2 } from "lucide-react";
import { Book } from "@/types";
import { ApiError, borrowBook } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BorrowButtonProps {
  book: Book;
}

/**
 * Client component that opens a confirmation dialog and submits the borrow
 * request for a book. Uses the centralized `apiFetch()` and refreshes the
 * server-rendered book data after a successful borrow. The modal shows the
 * authenticated user's name and email as read-only fields.
 */
export function BorrowButton({ book }: BorrowButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canBorrow = book.availableCopies > 0;
  const bookId = book._id || "";
  const userName = session?.user?.name ?? "";
  const userEmail = session?.user?.email ?? "";

  const handleConfirm = async () => {
    // Prevent repeated submissions while a request is pending.
    if (!canBorrow || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await borrowBook(bookId);
      toast.success(`You borrowed "${book.title}" — it will be due in 7 days.`);
      setIsDialogOpen(false);
      // Refresh the page data so Available Copies reflects the backend value.
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("You are signed out or your session expired. Please sign in again.");
      } else {
        toast.error(
          err instanceof Error && err.message
            ? err.message
            : "Failed to borrow this book. Please try again."
        );
      }
      // Keep the dialog open so the user can retry or cancel.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto pt-3 border-t border-border/60">
      <Button
        variant="default"
        size="default"
        className="w-full justify-center gap-2 font-medium"
        disabled={!canBorrow}
        onClick={() => setIsDialogOpen(true)}
      >
        <BookCheck className="size-4" />
        <span>{canBorrow ? "Borrow Book" : "Not Available"}</span>
      </Button>

      {/* Confirmation dialog (hand-rolled, consistent with the design system). */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm borrow"
            className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card shadow-lg animate-in fade-in-0 zoom-in-95"
          >
            <div className="space-y-1.5 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-foreground">Borrow “{book.title}”?</h2>
              {/* Read-only user identity — populated from the authenticated session. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="borrow-user-name">User Name</Label>
                  <Input
                    id="borrow-user-name"
                    type="text"
                    value={userName}
                    readOnly
                    placeholder="Unavailable"
                    className="h-10 bg-muted text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="borrow-user-email">User Email</Label>
                  <Input
                    id="borrow-user-email"
                    type="email"
                    value={userEmail}
                    readOnly
                    placeholder="Unavailable"
                    className="h-10 bg-muted text-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground pt-1">
                <CalendarDays className="size-3.5" />
                <span>You have 7 days to return this book.</span>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                Confirming the borrow returns a copy of this book to the shelf.
                Please return it by the due date.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-4">
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-2 font-medium"
                onClick={handleConfirm}
                disabled={isSubmitting || !canBorrow}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <BookCheck className="size-4" />
                )}
                <span>Confirm Borrow</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

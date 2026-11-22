"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { ApiError, deleteBorrow } from "@/lib/api";
import { Borrow } from "@/types";
import { Button } from "@/components/ui/button";

interface ReturnBorrowDialogProps {
  borrow: Borrow;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful return so the parent removes the item from the list. */
  onReturned: (borrowId: string) => void;
}

/**
 * Hand-rolled confirmation dialog (consistent with the design system) that
 * returns a borrowed book after confirmation. Uses the backend
 * `DELETE /borrows/:id` API — the borrow record ID, not the book ID. The
 * backend verifies the record belongs to the authenticated user.
 */
export function ReturnBorrowDialog({
  borrow,
  isOpen,
  onOpenChange,
  onReturned,
}: ReturnBorrowDialogProps) {
  const [isReturning, setIsReturning] = useState(false);
  const borrowId = borrow._id || "";

  const handleConfirm = async () => {
    // Prevent repeated submissions while a request is pending.
    if (isReturning) {
      return;
    }

    setIsReturning(true);

    try {
      await deleteBorrow(borrowId);
      toast.success(`"${borrow.bookTitle}" returned successfully.`);
      onReturned(borrowId);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("You are signed out or your session expired. Please sign in again.");
      } else {
        toast.error(
          err instanceof Error && err.message
            ? err.message
            : "Failed to return the book. Please try again."
        );
      }
      // Keep the dialog open and the record visible so the user can retry.
    } finally {
      setIsReturning(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Return ${borrow.bookTitle}`}
        className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="space-y-1.5 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">
            Return “{borrow.bookTitle}”?
          </h2>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Confirming the return restores one copy of this book to the
            library. The copy becomes available for borrowing again.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2 font-medium"
            onClick={handleConfirm}
            disabled={isReturning}
          >
            {isReturning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            <span>Return Book</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { ApiError, deleteBorrow } from "@/lib/api";
import { Borrow } from "@/types";
import { Button } from "@/components/ui/button";

interface ReturnBorrowDialogProps {
  borrow: Borrow;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReturned: (borrowId: string) => void;
}

// `isMounted` is derived from `useSyncExternalStore`: the dialog only
// renders after the client is mounted (the server snapshot is false).
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ReturnBorrowDialog({
  borrow,
  isOpen,
  onOpenChange,
  onReturned,
}: ReturnBorrowDialogProps) {
  const [isReturning, setIsReturning] = useState(false);
  const isMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const borrowId = borrow._id || "";

  const handleConfirm = async () => {
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
        toast.error(
          "You are signed out or your session expired. Please sign in again."
        );
      } else {
        toast.error(
          err instanceof Error && err.message
            ? err.message
            : "Failed to return the book. Please try again."
        );
      }
    } finally {
      setIsReturning(false);
    }
  };

  // Do not render before mounting or when the dialog is closed.
  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
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
            disabled={isReturning}
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
    </div>,
    document.body
  );
}

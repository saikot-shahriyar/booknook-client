"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Book } from "@/types";
import { deleteBook } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface DeleteBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (bookId: string) => void;
}

/**
 * Hand-rolled confirmation dialog (consistent with the design system) that
 * deletes a book after confirmation. Uses the backend `DELETE /books/:id`
 * API, which only allows the creator who added the book.
 */
export function DeleteBookDialog({ book, isOpen, onOpenChange, onDeleted }: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const bookId = book._id || "";

  const handleConfirm = async () => {
    // Prevent repeated submissions while a request is pending.
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteBook(bookId);
      toast.success(`"${book.title}" deleted successfully.`);
      onDeleted(bookId);
      onOpenChange(false);
    } catch (err) {
      // Keep the dialog open so the user can retry or cancel.
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Failed to delete the book. Please try again."
      );
    } finally {
      setIsDeleting(false);
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
        aria-label={`Delete ${book.title}`}
        className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="space-y-1.5 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">Delete “{book.title}”?</h2>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            This permanently removes the book from the BookNook catalog. Other
            users will no longer be able to view or borrow it, and this action
            cannot be undone.
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
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            <span>Delete Book</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";
import { Book } from "@/types";
import { getStatusStyle } from "@/components/books/status-styles";

export function BookCopiesPanel({ book }: { book: Book }) {
  const isAvailable = (book.availableCopies ?? 0) > 0;
  const availabilityStyle = getStatusStyle(
    isAvailable ? "Available" : "Out of Stock"
  );

  return (
    <div className="rounded-lg border border-border/60 bg-muted/60 px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Total Copies
        </span>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {book.totalCopies}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mt-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Available Copies
        </span>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {book.availableCopies}
        </span>
      </div>

      {/* Availability status only — the separate "Availability" label was removed. */}
      <div className="mt-1.5">
        <span className={availabilityStyle.badge}>
          <CheckCircle2 className={availabilityStyle.icon} />
          <span>{isAvailable ? "Available for Borrow" : "Out of Stock"}</span>
        </span>
      </div>
    </div>
  );
}

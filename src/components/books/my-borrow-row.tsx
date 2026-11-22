"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { Borrow } from "@/types";
import { formatBorrowDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReturnBorrowDialog } from "@/components/books/return-borrow-dialog";

interface MyBorrowRowProps {
  borrow: Borrow;
  /** Called after a successful return so the parent removes the row from the table. */
  onReturned: (borrowId: string) => void;
}

/**
 * Desktop table row for the My Borrows page: shows the book (image + title),
 * borrow date, return date, status and a Return Book action.
 */
export function MyBorrowRow({ borrow, onReturned }: MyBorrowRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageUrl = borrow.bookImage?.trim();

  return (
    <>
      <tr className="group hover:bg-muted/40 transition-colors">
        {/* Book: cover image + title */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={borrow.bookTitle}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
                unoptimized
              />
            ) : (
              <div className="flex w-12 h-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                <BookOpen className="size-5 text-muted-foreground" />
              </div>
            )}
            <span className="font-medium text-foreground">{borrow.bookTitle}</span>
          </div>
        </td>

        {/* Borrow Date */}
        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
          {formatBorrowDate(borrow.borrowDate)}
        </td>

        {/* Return Date */}
        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
          {formatBorrowDate(borrow.returnDate)}
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-background/90 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 backdrop-blur-md shadow-xs">
            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>Active</span>
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-medium"
            onClick={() => setIsDialogOpen(true)}
          >
            <RotateCcw className="size-3.5" />
            <span>Return</span>
          </Button>
        </td>
      </tr>

      {/* Action dialog (state lives here so each row owns its dialog). */}
      <ReturnBorrowDialog
        borrow={borrow}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onReturned={onReturned}
      />
    </>
  );
}

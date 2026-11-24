"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, CalendarDays, CheckCircle2, RotateCcw } from "lucide-react";
import { Borrow } from "@/types";
import { formatBorrowDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReturnBorrowDialog } from "@/components/books/return-borrow-dialog";
import { getStatusStyle } from "@/components/books/status-styles";

interface MyBorrowItemProps {
  borrow: Borrow;
  /** Called after a successful return so the parent removes the item from the list. */
  onReturned: (borrowId: string) => void;
}

export function MyBorrowItem({ borrow, onReturned }: MyBorrowItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageUrl = borrow.bookImage?.trim();
  const activeStyle = getStatusStyle("Active");

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden">
      {/* Cover Image + Active Badge */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={borrow.bookTitle}
            fill
            sizes="(max-width: 640px) 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-muted-foreground/60">
            <BookOpen className="size-12 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <span className={activeStyle.badge}>
            <CheckCircle2 className={activeStyle.icon} />
            <span>Active</span>
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 gap-2.5 px-4 pb-4">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-snug">
          {borrow.bookTitle}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>Borrowed: {formatBorrowDate(borrow.borrowDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5 shrink-0 text-muted-foreground/80" />
            <span>Due: {formatBorrowDate(borrow.returnDate)}</span>
          </div>
        </div>

        <div className="mt-auto flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-medium"
            onClick={() => setIsDialogOpen(true)}
          >
            <RotateCcw className="size-3.5" />
            <span>Return Book</span>
          </Button>
        </div>
      </div>

      {/* Action dialog (state lives here so each card owns its dialog). */}
      <ReturnBorrowDialog
        borrow={borrow}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onReturned={onReturned}
      />
    </article>
  );
}

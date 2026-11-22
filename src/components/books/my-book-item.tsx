"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, CheckCircle2, Pencil, Trash2, User, XCircle } from "lucide-react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { categoryBadgeStyles } from "@/components/books/book-card";
import { cn } from "@/lib/utils";

interface MyBookItemProps {
  book: Book;
  /** Called after a successful edit so the parent list refreshes. */
  onEdited: (bookId: string) => void;
  /** Called after a successful delete so the parent removes the item. */
  onDeleted: (bookId: string) => void;
}

/**
 * Card for the My Books page: shows the cover, title, author, category and
 * available copies, with Edit and Delete actions.
 */
export function MyBookItem({ book, onEdited, onDeleted }: MyBookItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const badgeStyle = categoryBadgeStyles[book.category] || categoryBadgeStyles["Others"];

  return (
    <article className="flex flex-col h-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden group">
      {/* Cover Image + Category Pill */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/50">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-muted-foreground/60">
            <BookOpen className="size-12 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs",
              badgeStyle
            )}>
            {book.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md shadow-xs border",
              isAvailable
                ? "bg-background/90 text-emerald-700 dark:text-emerald-400 border-emerald-300/40"
                : "bg-background/90 text-rose-700 dark:text-rose-400 border-rose-300/40"
            )}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>{book.availableCopies} Copies Available</span>
              </>
            ) : (
              <>
                <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
                <span>Out of Stock</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-snug">
          {book.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {book.description && (
          <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
          <span className="text-xs font-medium text-muted-foreground">
            Total: {book.totalCopies}
          </span>
          <div className="ml-auto flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-medium"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 font-medium"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Action dialogs (state lives here so each card owns its dialogs). */}
      <EditBookDialog
        key={isEditOpen ? book._id || book.title : "closed"}
        book={book}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSaved={onEdited}
      />
      <DeleteBookDialog
        book={book}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={onDeleted}
      />
    </article>
  );
}

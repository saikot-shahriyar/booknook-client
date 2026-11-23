"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Pencil, Trash2, User } from "lucide-react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { categoryBadgeStyles, BOOK_CARD_IMAGE_CLASSES } from "@/components/books/book-card";
import { BookCopiesPanel } from "@/components/books/copies-panel";
import { cn } from "@/lib/utils";

interface MyBookItemProps {
  book: Book;
  /** Called after a successful edit so the parent list refreshes. */
  onEdited: (bookId: string) => void;
  /** Called after a successful delete so the parent removes the item. */
  onDeleted: (bookId: string) => void;
}

/**
 * Card for the My Books page: shows the cover, category, title, author and
 * the copies information panel, with Edit and Delete actions. Uses the same
 * visual language as BookCard (shared image area, badge, panel, typography).
 */
export function MyBookItem({ book, onEdited, onDeleted }: MyBookItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const badgeStyle = categoryBadgeStyles[book.category] || categoryBadgeStyles["Others"];

  return (
    <article className="flex flex-col h-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden group">
      {/* Cover image — same image area as BookCard. */}
      <div className={BOOK_CARD_IMAGE_CLASSES}>
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground/60">
            <BookOpen className="size-10 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium">Cover Not Available</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 gap-2 px-4 pb-4">
        {/* Category pill badge — below the image, inside the content. */}
        <span
          className={cn(
            "inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            badgeStyle
          )}
        >
          {book.category}
        </span>

        <h3 className="text-base font-bold leading-snug line-clamp-2 text-foreground">
          {book.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {/* Copies information panel (Total / Available / Availability). */}
        <BookCopiesPanel book={book} />

        {book.description && (
          <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Actions — Edit and Delete, aligned at the bottom of the card. */}
        <div className="mt-auto flex shrink-0 justify-end gap-2">
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

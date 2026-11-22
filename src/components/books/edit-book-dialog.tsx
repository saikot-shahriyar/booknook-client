"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  FileImage,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import { Book, BookCategory, UpdateBookRequest } from "@/types";
import { updateBook, uploadBookImage } from "@/lib/api";
import { CATEGORY_OPTIONS } from "@/components/books/add-book-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Maximum accepted cover-image size: 5 MB. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Compares two files by reference or by name/size/lastModified. */
const isSameFile = (a: File | null, b: File | null): boolean =>
  !!a &&
  !!b &&
  (a === b || (a.name === b.name && a.size === b.size && a.lastModified === b.lastModified));

interface EditBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (bookId: string) => void;
}

/**
 * Modal dialog to edit an existing book (owner only). State is initialized
 * from the book the dialog was opened with — the dialog unmounts when
 * closed (see the `key` usage in `MyBookItem`), so reopening it re-prefills
 * from the current book. Saves through `PATCH /books/:id`.
 */
export function EditBookDialog({ book, isOpen, onOpenChange, onSaved }: EditBookDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category || "");
  const [description, setDescription] = useState(book.description || "");
  const [totalCopies, setTotalCopies] = useState(
    book.totalCopies != null ? String(book.totalCopies) : ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState(book.image || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isBusy = isUploading || isSaving;

  if (!isOpen) {
    return null;
  }

  /** Client-side check that the picked file is a reasonably sized image. */
  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file.";
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return "Image files must be 5 MB or smaller.";
    }
    return null;
  };

  const handleFileSelect = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setImageUrl("");
    setUploadedFile(null);
    setErrors((prev) => ({ ...prev, image: "" }));

    if (!file) {
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: validateFile(file) ?? "" }));
  };

  const handleUploadImage = async () => {
    if (!imageFile || isBusy || isSameFile(imageFile, uploadedFile)) {
      return;
    }

    setIsUploading(true);

    try {
      const url = await uploadBookImage(imageFile);
      setImageUrl(url);
      setUploadedFile(imageFile);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedDescription = description.trim();
    const total = Number(totalCopies);

    const newErrors: Record<string, string> = {};
    if (!trimmedTitle) newErrors.title = "Please enter the book title.";
    if (!trimmedAuthor) newErrors.author = "Please enter the author name.";
    if (!category) newErrors.category = "Please select a category.";
    if (!trimmedDescription) newErrors.description = "Please enter a short description.";
    if (!Number.isInteger(total) || total < 1) {
      newErrors.totalCopies = "Total Copies must be a positive integer.";
    }
    if (!imageUrl) {
      newErrors.image = "A book cover image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const payload: UpdateBookRequest = {
        title: trimmedTitle,
        author: trimmedAuthor,
        category: category as BookCategory,
        image: imageUrl,
        description: trimmedDescription,
        totalCopies: total,
      };

      await updateBook(book._id || "", payload);
      toast.success("Book updated successfully.");
      onSaved(book._id || "");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Failed to update the book. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <form
        onSubmit={handleSave}
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${book.title}`}
        className="relative flex w-full max-w-xl flex-col overflow-x-hidden rounded-3xl border border-border/80 bg-card text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95 max-h-[85dvh] md:max-h-[90dvh]"
      >
        <div className="border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Edit Book</h2>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                type="text"
                placeholder="e.g. The Great Gatsby"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isBusy}
                className="h-10 text-foreground"
              />
              {errors.title && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-author">Author Name</Label>
              <Input
                id="edit-author"
                type="text"
                placeholder="e.g. F. Scott Fitzgerald"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isBusy}
                className="h-10 text-foreground"
              />
              {errors.author && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.author}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isBusy}
                className={cn(
                  "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm disabled:opacity-50",
                  errors.category && "border-destructive"
                )}
              >
                <option value="">Select a category</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-total-copies">Total Copies</Label>
              <Input
                id="edit-total-copies"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="e.g. 5"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                disabled={isBusy}
                className="h-10 text-foreground"
              />
              {errors.totalCopies && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.totalCopies}
                </p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="edit-description">Short Description</Label>
              <textarea
                id="edit-description"
                rows={4}
                placeholder="Write a short, compelling description of the book."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isBusy}
                className="min-h-[88px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 disabled:opacity-50 md:text-base"
              />
              {errors.description && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label>Book Cover Image</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    className="gap-2"
                  >
                    <FileImage className="size-4" />
                    <span>Select Image</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isBusy}
                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadImage}
                    disabled={isBusy || !imageFile || isSameFile(imageFile, uploadedFile)}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <span>{isUploading ? "Uploading…" : "Upload Image"}</span>
                  </Button>
                  {imageUrl && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span>Image uploaded</span>
                    </span>
                  )}
                </div>

                {imageFile && (
                  <p className="text-xs text-muted-foreground">
                    {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </p>
                )}

                {errors.image && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.image}
                  </p>
                )}

                {(imagePreview || imageUrl) && (
                  <div className="relative w-full max-w-xs mx-auto aspect-[3/4] overflow-hidden rounded-lg border border-border bg-muted/50">
                    <Image
                      src={imagePreview || imageUrl}
                      alt="Book cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Max 5 MB. Images are uploaded to ImgBB and stored with the book.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isBusy}
            className="gap-2 font-semibold shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

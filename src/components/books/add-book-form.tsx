"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  FileImage,
  Loader2,
  Package,
  Upload,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { ApiError, createBook, uploadBookImage } from "@/lib/api";
import { BookCategory, CreateBookRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const CATEGORY_OPTIONS: BookCategory[] = ["Fiction", "Science", "History", "Kids", "Others"];

/** Maximum accepted cover-image size: 5 MB. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface AddBookFormState {
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: string;
}

interface FieldErrors {
  title?: string;
  author?: string;
  category?: string;
  description?: string;
  totalCopies?: string;
  image?: string;
}

const DEFAULT_FORM: AddBookFormState = {
  title: "",
  author: "",
  category: "",
  description: "",
  totalCopies: "",
};

/**
 * Client component for the Add Book page (`/add-book`).
 *
 * 1. The user selects a cover image; the local file is validated and previewed.
 * 2. The image is uploaded to ImgBB via the server-side proxy route
 *    `/api/upload` — the ImgBB API key never reaches the browser.
 * 3. Once an image URL is hosted, the book data is submitted to the backend
 *    through the centralized `createBook()` helper in `@/lib/api`.
 */
export function AddBookForm() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<AddBookFormState>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isUploading || isSubmitting;

  /**
   * True when both files describe the same image (same reference, or the
   * user re-picked the same file), so it cannot be uploaded twice.
   */
  const isSameFile = (a: File | null, b: File | null): boolean =>
    !!a &&
    !!b &&
    (a === b || (a.name === b.name && a.size === b.size && a.lastModified === b.lastModified));

  const userName = session?.user?.name ?? "";
  const userEmail = session?.user?.email ?? "";

  const setField = (field: keyof AddBookFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Image upload failed. Please try again.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const title = form.title.trim();
    const author = form.author.trim();
    const description = form.description.trim();
    const totalCopies = Number(form.totalCopies);

    const newErrors: FieldErrors = {};
    if (!title) newErrors.title = "Please enter the book title.";
    if (!author) newErrors.author = "Please enter the author name.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!description) newErrors.description = "Please enter a short description.";
    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      newErrors.totalCopies = "Total Copies must be a positive integer.";
    }
    if (!imageUrl) {
      newErrors.image = "Please upload a book image before adding the book.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateBookRequest = {
        title,
        author,
        category: form.category as BookCategory,
        image: imageUrl,
        description,
        totalCopies,
      };

      const response = await createBook(payload);

      toast.success("Book added successfully!");
      const newBookId = response?.data?._id;
      if (newBookId) {
        router.push(`/books/${newBookId}`);
      } else {
        router.push("/books");
      }
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError && err.message
          ? err.message
          : err instanceof Error && err.message
            ? err.message
            : "Failed to add the book. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto shadow-xs">
          <BookOpen className="size-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Add a New Book
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Share a new title with the BookNook library. Add the cover image, details, and copy count.
        </p>
      </div>

      {/* Session status while the Better Auth session resolves */}
      {isSessionPending && (
        <div className="flex items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Book Title */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">Book Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g. The Great Gatsby"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              disabled={isBusy}
              className="h-10 text-foreground"
            />
            {errors.title && (
              <p role="alert" className="text-xs text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <Label htmlFor="author">Author Name</Label>
            <Input
              id="author"
              type="text"
              placeholder="e.g. F. Scott Fitzgerald"
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
              disabled={isBusy}
              className="h-10 text-foreground"
            />
            {errors.author && (
              <p role="alert" className="text-xs text-destructive">
                {errors.author}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              disabled={isBusy}
              className={cn(
                "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm disabled:opacity-50",
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

          {/* Total Copies */}
          <div className="space-y-1.5">
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              id="totalCopies"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              placeholder="e.g. 5"
              value={form.totalCopies}
              onChange={(e) => setField("totalCopies", e.target.value)}
              disabled={isBusy}
              className="h-10 text-foreground"
            />
            {errors.totalCopies && (
              <p role="alert" className="text-xs text-destructive">
                {errors.totalCopies}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description">Short Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Write a short, compelling description of the book."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              disabled={isBusy}
              className="min-h-[88px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-base"
            />
            {errors.description && (
              <p role="alert" className="text-xs text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* Book Image */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Book Image</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="h-10 gap-2"
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
                  className="h-10 gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  <span>{isUploading ? "Uploading…" : "Upload Image"}</span>
                </Button>
                {imageUrl && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
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

        {/* Logged-in user details (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="userName">User Name (Read Only)</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              readOnly
              disabled={isBusy}
              className="h-10 bg-muted text-foreground"
              placeholder={isSessionPending ? "Loading…" : "Unavailable"}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="userEmail">User Email (Read Only)</Label>
            <Input
              id="userEmail"
              type="email"
              value={userEmail}
              readOnly
              disabled={isBusy}
              className="h-10 bg-muted text-foreground"
              placeholder={isSessionPending ? "Loading…" : "Unavailable"}
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={isBusy}
          className="w-full justify-center gap-2 font-semibold h-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Adding Book…</span>
            </>
          ) : (
            <>
              <Package className="size-4" />
              <span>Add Book</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

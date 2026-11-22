import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { AddBookForm } from "@/components/books/add-book-form";

export const instant = false;

export const metadata: Metadata = {
  title: "Add Book",
  description: "Add a new book to the BookNook library collection.",
};

export default async function AddBookPage() {
  await requireAuth("/add-book");

  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center min-h-[60vh] py-16 px-4 sm:px-6 lg:px-8">
        <AddBookForm />
      </div>
    </ProtectedRoute>
  );
}

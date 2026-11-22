import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { MyBooksList } from "@/components/books/my-books-list";

export const instant = false;

export const metadata: Metadata = {
  title: "My Books",
  description: "Manage the books you have added to the BookNook library.",
};

export default async function MyBooksPage() {
  await requireAuth("/my-books");

  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center min-h-[60vh] py-16 px-4">
        <MyBooksList />
      </div>
    </ProtectedRoute>
  );
}

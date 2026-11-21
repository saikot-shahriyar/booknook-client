import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { BookMarked } from "lucide-react";

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
        <div className="text-center space-y-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <BookMarked className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">My Books</h1>
          <p className="text-sm max-w-sm mx-auto">
            Your added books, with edit and delete actions, will appear here.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

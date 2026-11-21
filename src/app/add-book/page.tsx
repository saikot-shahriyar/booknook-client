import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { PlusCircle } from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  title: "Add Book",
  description: "Add a new book to the BookNook library collection.",
};

export default async function AddBookPage() {
  await requireAuth("/add-book");

  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center min-h-[60vh] py-16 px-4">
        <div className="text-center space-y-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <PlusCircle className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Add a New Book</h1>
          <p className="text-sm max-w-sm mx-auto">
            The book submission form will be built here in the next task.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

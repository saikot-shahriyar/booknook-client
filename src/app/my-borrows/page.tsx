import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { BookmarkCheck } from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  title: "My Borrows",
  description: "View your borrowed books and return them from BookNook.",
};

export default async function MyBorrowsPage() {
  await requireAuth("/my-borrows");

  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center min-h-[60vh] py-16 px-4">
        <div className="text-center space-y-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <BookmarkCheck className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">My Borrows</h1>
          <p className="text-sm max-w-sm mx-auto">
            Your active and past borrowings, with return actions, will be shown here.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

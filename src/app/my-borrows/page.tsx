import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { MyBorrowList } from "@/components/books/my-borrows-list";

export const instant = false;

export const metadata: Metadata = {
  title: "My Borrows",
  description: "View your borrowed books and return them from BookNook.",
};

export default async function MyBorrowsPage() {
  await requireAuth("/my-borrows");

  return (
    <ProtectedRoute>
      <MyBorrowList />
    </ProtectedRoute>
  );
}

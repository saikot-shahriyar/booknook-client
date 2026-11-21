import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { BookOpen } from "lucide-react";

// Opt out of instant/static prerender — this route needs runtime data (params + session)
export const instant = false;

export const metadata: Metadata = {
  title: "Book Details",
  description: "View full book details, availability, and borrow this book.",
};

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params;
  await requireAuth(`/books/${id}`);

  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center min-h-[60vh] py-16 px-4">
        <div className="text-center space-y-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <BookOpen className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Book Details</h1>
          <p className="text-sm max-w-sm mx-auto">
            Detailed view for book <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{id}</span> will be built here.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

import Link from "next/link";
import { BookOpen, Library, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <BookOpen className="size-3.5 text-primary" />
          <span>Welcome to BookNook</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Your Cozy Online Library
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Explore a growing sanctuary of stories, manage your personal borrows, and connect with fellow book enthusiasts.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 font-medium shadow-xs"
            )}
          >
            <Library className="size-4" />
            <span>Browse Library</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 font-medium"
            )}
          >
            <span>Join BookNook</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

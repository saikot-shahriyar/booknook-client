import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your BookNook account to manage your books and borrows.",
};

function LoginLoadingSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-6 animate-pulse">
      <div className="flex flex-col items-center space-y-3">
        <div className="size-11 rounded-2xl bg-muted" />
        <div className="h-7 w-48 rounded-md bg-muted" />
        <div className="h-4 w-64 rounded-md bg-muted/60" />
      </div>
      <div className="h-10 rounded-lg bg-muted" />
      <div className="space-y-4 pt-2">
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <Suspense fallback={<LoginLoadingSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

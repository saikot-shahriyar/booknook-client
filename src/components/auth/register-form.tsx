"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons/google-icon";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password criteria evaluations
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (photoUrl.trim() && !/^https?:\/\/.+/.test(photoUrl.trim())) {
      setError("Please enter a valid image URL starting with http:// or https://");
      return;
    }

    if (!isPasswordValid) {
      if (!hasMinLength) {
        setError("Password must be at least 6 characters long.");
      } else if (!hasUppercase) {
        setError("Password must include at least one uppercase letter (A-Z).");
      } else if (!hasLowercase) {
        setError("Password must include at least one lowercase letter (a-z).");
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        image: photoUrl.trim() || undefined,
      });

      if (response.error) {
        const message = response.error.message || "Failed to create account. Please try again.";
        setError(message);
        toast.error(message);
      } else {
        toast.success("Account created successfully! Please sign in with your new account.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred during registration.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (result?.error) {
        toast.error(
          result.error.message ||
            "Google Registration is not configured yet. Please register with your email."
        );
      }
    } catch {
      toast.error(
        "Google Registration is not configured yet. Please register with your email."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto shadow-xs">
          <BookOpen className="size-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join BookNook to discover books, borrow titles, and enjoy the community library.
        </p>
      </div>

      {/* Google Sign-up Button */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full justify-center gap-2 font-semibold h-10"
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        <span>Sign up with Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground select-none shrink-0">
          Or register with email
        </span>
        <div className="border-t border-border w-full" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g. Jane Austen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            autoComplete="name"
            required
            className="h-10"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            autoComplete="email"
            required
            className="h-10"
          />
        </div>

        {/* Photo URL */}
        <div className="space-y-1.5">
          <Label htmlFor="photoUrl">
            Profile Photo URL{" "}
            <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Input
            id="photoUrl"
            type="url"
            placeholder="https://i.ibb.co/... or your photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            className="h-10"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              autoComplete="new-password"
              required
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {/* Password Validation Hints */}
          {password.length > 0 && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5 mt-2">
              <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
                Password Requirements:
              </span>
              <div className="grid grid-cols-1 gap-1">
                <div
                  className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 className="size-3.5 shrink-0" />
                  ) : (
                    <XCircle className="size-3.5 shrink-0" />
                  )}
                  <span>At least 6 characters long</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}
                >
                  {hasUppercase ? (
                    <CheckCircle2 className="size-3.5 shrink-0" />
                  ) : (
                    <XCircle className="size-3.5 shrink-0" />
                  )}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}
                >
                  {hasLowercase ? (
                    <CheckCircle2 className="size-3.5 shrink-0" />
                  ) : (
                    <XCircle className="size-3.5 shrink-0" />
                  )}
                  <span>At least one lowercase letter (a-z)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading || isGoogleLoading}
          className="w-full justify-center gap-2 font-semibold h-10 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              <span>Create Account</span>
            </>
          )}
        </Button>
      </form>

      {/* Footer link to Login */}
      <div className="text-center pt-2 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-semibold text-primary hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export { RegisterForm };

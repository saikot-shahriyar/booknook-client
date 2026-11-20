"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Client-side route guard.
 * Wraps private pages — redirects unauthenticated users to /login with a callbackUrl.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      const callbackUrl = encodeURIComponent(pathname ?? "/");
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [session, isPending, router, pathname]);

  // While the session is loading, show a full-page spinner
  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Verifying your session…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is in progress; show nothing to avoid flash
  if (!session) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  Loader2,
  Mail,
  ShieldCheck,
  User,
  KeyRound,
  CalendarDays,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn, formatBorrowDate } from "@/lib/utils";

interface AccountInfoTileProps {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

/**
 * One row of the Account Information section: label above a value with an icon.
 */
function AccountInfoTile({ icon, label, value, mono = false }: AccountInfoTileProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/40 px-4 py-3.5 space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        <span className={cn("min-w-0 truncate", mono && "font-mono text-xs")}>
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * Avatar mirroring the navbar's UserAvatar: shows the photo when available,
 * otherwise a rounded circle of the user's initials.
 */
function ProfileAvatar({
  name,
  image,
  size = "md",
}: {
  name: string | null | undefined;
  image: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const initials = (name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dimension = size === "sm" ? 36 : size === "lg" ? 96 : 48;
  const sizeClass = size === "sm" ? "size-7" : size === "lg" ? "size-24" : "size-9";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User avatar"}
        width={dimension}
        height={dimension}
        className={cn(
          sizeClass,
          "rounded-full object-cover ring-2 ring-primary/20 ring-offset-1"
        )}
        unoptimized
        onError={(e) => {
          // Fallback to initials when the remote image fails to load.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ring-2 ring-primary/20 ring-offset-1 select-none"
      )}
    >
      {initials}
    </div>
  );
}


export function MyProfileCard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Loading state while the session is being resolved.
  if (isPending) {
    return (
      <div className="w-full py-10 sm:py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading your profile…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated users are redirected to /login by ProtectedRoute; nothing to render.
  if (!user) {
    return null;
  }

  return (
    <div className="w-full py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="border-b border-border/70 pb-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <User className="size-3.5" />
            <span>Your Account</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                My Profile
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                View your name, email address, and account information.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Panel */}
        <div className="rounded-2xl border border-border/80 bg-card shadow-sm p-5 sm:p-8 space-y-6">
          {/* Identity header: avatar, name, email address */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <ProfileAvatar name={user.name} image={user.image} size="lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {user.name || "User"}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user.email || "—"}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-300/40">
              <ShieldCheck className="size-3.5" />
              <span>Active</span>
            </span>
          </div>

          <div className="h-px w-full bg-border/60" />

          {/* Account Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AccountInfoTile
              icon={<KeyRound className="size-4 text-muted-foreground" />}
              label="Account ID"
              value={user.id || "—"}
              mono
            />
            <AccountInfoTile
              icon={<ShieldCheck className="size-4 text-muted-foreground" />}
              label="Email Verification"
              value={user.emailVerified ? "Verified" : "Not verified"}
            />
            <AccountInfoTile
              icon={<CalendarDays className="size-4 text-muted-foreground" />}
              label="Member since"
              value={formatBorrowDate(
                user.createdAt ? new Date(user.createdAt).toISOString() : undefined
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

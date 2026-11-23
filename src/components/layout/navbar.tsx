"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Library,
  PlusCircle,
  BookMarked,
  BookmarkCheck,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

// Map nav titles to Lucide icons
const navIcons: Record<string, React.ReactNode> = {
  Home: <BookOpen className="size-4 text-white" />,
  "All Books": <Library className="size-4 text-white" />,
  "Add Book": <PlusCircle className="size-4 text-white" />,
  "My Books": <BookMarked className="size-4 text-white" />,
  "My Borrows": <BookmarkCheck className="size-4 text-white" />,
};

/** Lightweight skeleton block used while session loads */
function NavSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="size-9 rounded-full bg-[#374151]" />
    </div>
  );
}

/** User avatar — shows photo if available, otherwise initials */
function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name: string | null | undefined;
  image: string | null | undefined;
  size?: "sm" | "md";
}) {
  const initials = (name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClass = size === "sm" ? "size-7" : "size-9";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User avatar"}
        width={36}
        height={36}
        className={cn(
          sizeClass,
          "rounded-full object-cover ring-2 ring-white/20 ring-offset-[#111827]"
        )}
        onError={(e) => {
          // Fallback to initials on image error
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-white text-[#2563EB] flex items-center justify-center text-xs font-bold ring-2 ring-white/20 ring-offset-[#111827] select-none"
      )}
    >
      {initials}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = useSession();
  const isAuthenticated = Boolean(session);
  const user = session?.user;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when the route changes.
  // Using startTransition avoids a synchronous setState-in-effect lint error
  // while still responding reactively to pathname changes.
  useEffect(() => {
    const id = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    ...siteConfig.nav.public,
    ...(isAuthenticated ? siteConfig.nav.private : []),
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await signOut();
      toast.success("You have been signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#374151]/50 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white transition-opacity hover:opacity-90 group shrink-0"
          >
            <div className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
              <Image
                src="/booknook.png"
                alt="BookNook logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                Book
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                Nook
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] hidden sm:inline-block">
                Library
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-[#374151] text-white"
                      : "text-white hover:bg-[#374151]"
                  )}
                >
                  {navIcons[link.title]}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* While session resolves, show a placeholder to avoid layout shift */}
            {isPending ? (
              <NavSkeleton />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#2563EB] bg-white hover:bg-[#374151] hover:text-white transition-colors"
                >
                  <LogIn className="size-4 text-[#2563EB]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#111827] bg-white hover:bg-[#374151] hover:text-white transition-colors"
                >
                  <UserPlus className="size-4 text-[#111827]" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              /* ---- Authenticated: Profile Dropdown ---- */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full px-1.5 py-1 hover:bg-[#374151] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-label="User menu"
                >
                  <UserAvatar name={user?.name} image={user?.image} />
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-white transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#374151] bg-[#111827] shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#374151]">
                      <UserAvatar
                        name={user?.name}
                        image={user?.image}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-[#9CA3AF] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <Link
                        href="/my-profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white hover:bg-[#374151] transition-colors"
                      >
                        <User className="size-4 text-white" />
                        <span>My Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white hover:bg-[#374151] transition-colors disabled:opacity-60"
                      >
                        <LogOut className="size-4 text-white" />
                        <span>{isSigningOut ? "Signing out…" : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center size-9 rounded-lg border border-[#374151] bg-[#111827] text-white hover:bg-[#374151] focus:outline-hidden focus:ring-2 focus:ring-ring transition-colors"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[#374151]/50 bg-[#111827] px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-[#374151] text-white font-semibold"
                      : "text-white hover:bg-[#374151]"
                  )}
                >
                  {navIcons[link.title]}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Section */}
          <div className="mt-4 pt-4 border-t border-[#374151]/50 flex flex-col gap-2">
            {isPending ? (
              <div className="flex justify-center py-2">
                <div className="size-5 rounded-full bg-[#374151] animate-pulse" />
              </div>
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-[#2563EB] bg-white hover:bg-[#374151] hover:text-white transition-colors"
                >
                  <LogIn className="size-4 text-[#2563EB]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] bg-white hover:bg-[#374151] hover:text-white transition-colors"
                >
                  <UserPlus className="size-4 text-[#111827]" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              /* Mobile authenticated section */
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#374151]">
                  <UserAvatar
                    name={user?.name}
                    image={user?.image}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-xs text-[#9CA3AF] truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/my-profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-white hover:bg-[#374151] transition-colors"
                >
                  <User className="size-4 text-white" />
                  <span>My Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-white hover:bg-[#374151] transition-colors disabled:opacity-60"
                >
                  <LogOut className="size-4 text-white" />
                  <span>{isSigningOut ? "Signing out…" : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

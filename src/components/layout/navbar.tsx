"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Map nav titles to Lucide icons
const navIcons: Record<string, React.ReactNode> = {
  Home: <BookOpen className="size-4" />,
  "All Books": <Library className="size-4" />,
  "Add Book": <PlusCircle className="size-4" />,
  "My Books": <BookMarked className="size-4" />,
  "My Borrows": <BookmarkCheck className="size-4" />,
};

interface NavbarProps {
  /**
   * Reserved for future authentication state (Better Auth)
   * Defaults to false (logged-out state).
   */
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active state for links
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    ...siteConfig.nav.public,
    ...(isAuthenticated ? siteConfig.nav.private : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground transition-opacity hover:opacity-90 group shrink-0"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <BookOpen className="size-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:inline-block">
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
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {navIcons[link.title]}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions (Logged-out state by default) */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "gap-1.5 text-muted-foreground hover:text-foreground font-medium"
                  )}
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "gap-1.5 shadow-xs font-medium"
                  )}
                >
                  <UserPlus className="size-4" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              // Reserved for authenticated user profile dropdown (Better Auth phase)
              <div
                data-slot="user-profile-menu-container"
                className="flex items-center gap-2"
              >
                {/* Profile menu slot */}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted focus:outline-hidden focus:ring-2 focus:ring-ring transition-colors"
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
          className="md:hidden border-t border-border/80 bg-background/98 px-4 pt-3 pb-5 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 duration-200"
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
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {navIcons[link.title]}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Buttons (Logged-out state) */}
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "w-full justify-center gap-2"
                  )}
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "w-full justify-center gap-2 shadow-xs"
                  )}
                >
                  <UserPlus className="size-4" />
                  <span>Register</span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}

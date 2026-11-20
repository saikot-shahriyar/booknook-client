import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import {
  XIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border/80 bg-muted/40 text-foreground transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground transition-opacity hover:opacity-90 group inline-flex"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <BookOpen className="size-5" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {siteConfig.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Library
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Community-Powered Library</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Book Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Book Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.categories.map((category) => (
                <li key={category.title}>
                  <Link
                    href={category.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Contact & Support
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} {siteConfig.name}. All rights reserved. Built with
            care for readers everywhere.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookNook on X (formerly Twitter)"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <XIcon className="size-3.5" />
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookNook on GitHub"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <GitHubIcon className="size-3.5" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookNook on LinkedIn"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LinkedInIcon className="size-3.5" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookNook on Facebook"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <FacebookIcon className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

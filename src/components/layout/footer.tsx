import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import {
  XIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";

/** Footer palette — dark navy premium theme */
const TEXT_WHITE = "#FFFFFF";
const TEXT_LIGHT_GRAY = "#D1D5DB";
const TEXT_MUTED = "#9CA3AF";
const ACCENT_BLUE = "#2563EB";
const ACCENT_EMERALD = "#059669";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactElement;
  /** Icon color shown by default */
  iconColor: string;
  /** Background color shown on hover (the platform brand color) */
  hoverBg: string;
  /** Icon color shown on hover — white when the brand color is used as bg */
  hoverIcon: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "BookNook on X (formerly Twitter)",
    href: siteConfig.social.x,
    icon: <XIcon className="size-4" />,
    iconColor: TEXT_WHITE,
    hoverBg: TEXT_WHITE,
    hoverIcon: "#171717",
  },
  {
    label: "BookNook on GitHub",
    href: siteConfig.social.github,
    icon: <GitHubIcon className="size-4" />,
    iconColor: TEXT_WHITE,
    hoverBg: TEXT_WHITE,
    hoverIcon: "#171717",
  },
  {
    label: "BookNook on LinkedIn",
    href: siteConfig.social.linkedin,
    icon: <LinkedInIcon className="size-4" />,
    iconColor: "#0A66C2",
    hoverBg: "#0A66C2",
    hoverIcon: TEXT_WHITE,
  },
  {
    label: "BookNook on Facebook",
    href: siteConfig.social.facebook,
    icon: <FacebookIcon className="size-4" />,
    iconColor: "#1877F2",
    hoverBg: "#1877F2",
    hoverIcon: TEXT_WHITE,
  },
];

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto bg-[#111827] text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand & Description */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-bold text-xl tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl shadow-md">
                <Image
                  src="/booknook.png"
                  alt="BookNook logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: ACCENT_EMERALD }}
              >
                Library
              </span>
            </Link>
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: TEXT_LIGHT_GRAY }}
            >
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#059669]/40 bg-[#059669]/10 px-3 py-1 text-xs font-medium"
              style={{ color: "#34D399" }}
            >
              <span className="size-2 rounded-full bg-[#059669] animate-pulse" />
              <span>Community-Powered Library</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Quick Links
            </h3>
            <span
              className="block h-px w-8 rounded-full"
              style={{ background: ACCENT_BLUE }}
            />
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Books", href: "/books" },
                { label: "Sign In", href: "/login" },
                { label: "Create Account", href: "/register" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-[#2563EB]"
                    style={{ color: TEXT_LIGHT_GRAY }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Book Categories */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Book Categories
            </h3>
            <span className="block h-px w-8 rounded-full bg-[#059669]" />
            <ul className="space-y-2.5 text-sm">
              {siteConfig.categories.map((category) => (
                <li key={category.title}>
                  <Link
                    href={category.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-[#059669]"
                    style={{ color: TEXT_LIGHT_GRAY }}
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Contact & Support
            </h3>
            <span
              className="block h-px w-8 rounded-full"
              style={{ background: ACCENT_BLUE }}
            />
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-[#2563EB] mt-0.5" />
                <span style={{ color: TEXT_LIGHT_GRAY }}>
                  {siteConfig.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[#2563EB]" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-white"
                  style={{ color: TEXT_LIGHT_GRAY }}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[#2563EB]" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="transition-colors hover:text-white"
                  style={{ color: TEXT_LIGHT_GRAY }}
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-[#2563EB]" />
                <span style={{ color: TEXT_LIGHT_GRAY }}>
                  {siteConfig.contact.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p
            className="text-center text-xs sm:text-left"
            style={{ color: TEXT_MUTED }}
          >
            &copy; {currentYear} {siteConfig.name}. All rights reserved. Built
            with care for readers everywhere.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                style={
                  {
                    color: link.iconColor,
                    "--footer-hover-bg": link.hoverBg,
                    "--footer-hover-icon": link.hoverIcon,
                  } as React.CSSProperties
                }
                className="group flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-[var(--footer-hover-bg)] hover:text-[var(--footer-hover-icon)] hover:shadow-[0_10px_22px_rgba(0,0,0,0.35)]"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

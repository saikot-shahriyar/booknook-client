/**
 * Shared, single source of truth for BookNook availability and borrowing
 * status badge styles.
 *
 * Each status maps to the approved main color (text/icon) and light
 * background. The `badge` classes are complete, consistent badges: standard
 * padding, radius, font weight and backdrop. All Tailwind class strings are
 * literal (containing the approved hex values) so the Tailwind scanner
 * generates the utilities — do not build these dynamically.
 */

export interface StatusStyle {
  /** Approved main color (hex) — badge text/icon color (light mode). */
  main: string;
  /** Approved light background (hex). */
  lightBg: string;
  /** Tailwind classes for the status badge. */
  badge: string;
  /** Tailwind classes for the status icon inside the badge. */
  icon: string;
}

/** Approved status palette (single source of truth). */
export const STATUS_STYLES: Record<string, StatusStyle> = {
  Available: {
    main: "#059669",
    lightBg: "#D1FAE5",
    badge:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#D1FAE5] text-[#059669] border-[#059669]/30 backdrop-blur-md shadow-xs",
    icon: "size-3 text-[#059669]",
  },
  "Out of Stock": {
    main: "#DC2626",
    lightBg: "#FEE2E2",
    badge:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30 backdrop-blur-md shadow-xs",
    icon: "size-3 text-[#DC2626]",
  },
  /** Borrowing status shown on the My Borrows pages (active borrow). */
  Active: {
    main: "#059669",
    lightBg: "#D1FAE5",
    badge:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#D1FAE5] text-[#059669] border-[#059669]/30 backdrop-blur-md shadow-xs",
    icon: "size-3 text-[#059669]",
  },
  Returned: {
    main: "#2563EB",
    lightBg: "#DBEAFE",
    badge:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#DBEAFE] text-[#2563EB] border-[#2563EB]/30 backdrop-blur-md shadow-xs",
    icon: "size-3 text-[#2563EB]",
  },
};

/** Fallback style for unknown or missing statuses. */
export const STATUS_DEFAULT_STYLE = STATUS_STYLES["Available"];

/**
 * Returns the approved style for a status.
 * Unknown or missing statuses fall back to the "Available" style.
 */
export function getStatusStyle(status: string): StatusStyle {
  return STATUS_STYLES[status] ?? STATUS_DEFAULT_STYLE;
}

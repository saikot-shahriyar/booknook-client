/**
 * Shared, single source of truth for BookNook book-category styles.
 *
 * Each category maps to its approved main color and light background.
 * All Tailwind class strings below are literal (containing the approved hex
 * values) so the Tailwind scanner generates the utilities — do not build
 * these dynamically.
 */

export interface CategoryStyle {
  /** Approved main color (hex) — text/icon/accent. */
  main: string;
  /** Approved light background (hex) — badge/card container. */
  lightBg: string;
  /** Tailwind classes for the BookCard/MyBookItem/Book Details badge. */
  badge: string;
  /** Tailwind classes for the ExploreCategories card. */
  card: string;
  /** Tailwind classes for the ExploreCategories category icon. */
  icon: string;
  /** Tailwind classes for the active BooksExplorer filter pill. */
  pill: string;
  /** Tailwind classes for the ExploreCategories title hover. */
  titleHover: string;
  /** Tailwind classes for the ExploreCategories CTA line accent. */
  accent: string;
}

/** Approved category palette (single source of truth). */
export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Fiction: {
    main: "#7C3AED",
    lightBg: "#F3E8FF",
    badge:
      "bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/30",
    card:
      "bg-[#F3E8FF] hover:border-[#7C3AED]/60 hover:shadow-md",
    icon:
      "text-[#7C3AED] bg-[#7C3AED]/10",
    pill: "bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/30 shadow-xs font-semibold",
    titleHover: "group-hover:text-[#7C3AED]",
    accent: "text-[#7C3AED]",
  },
  Science: {
    main: "#2563EB",
    lightBg: "#DBEAFE",
    badge:
      "bg-[#DBEAFE] text-[#2563EB] border-[#2563EB]/30",
    card:
      "bg-[#DBEAFE] hover:border-[#2563EB]/60 hover:shadow-md",
    icon:
      "text-[#2563EB] bg-[#2563EB]/10",
    pill: "bg-[#DBEAFE] text-[#2563EB] border-[#2563EB]/30 shadow-xs font-semibold",
    titleHover: "group-hover:text-[#2563EB]",
    accent: "text-[#2563EB]",
  },
  History: {
    main: "#D97706",
    lightBg: "#FEF3C7",
    badge:
      "bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30",
    card:
      "bg-[#FEF3C7] hover:border-[#D97706]/60 hover:shadow-md",
    icon:
      "text-[#D97706] bg-[#D97706]/10",
    pill: "bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30 shadow-xs font-semibold",
    titleHover: "group-hover:text-[#D97706]",
    accent: "text-[#D97706]",
  },
  Kids: {
    main: "#059669",
    lightBg: "#D1FAE5",
    badge:
      "bg-[#D1FAE5] text-[#059669] border-[#059669]/30",
    card:
      "bg-[#D1FAE5] hover:border-[#059669]/60 hover:shadow-md",
    icon:
      "text-[#059669] bg-[#059669]/10",
    pill: "bg-[#D1FAE5] text-[#059669] border-[#059669]/30 shadow-xs font-semibold",
    titleHover: "group-hover:text-[#059669]",
    accent: "text-[#059669]",
  },
  Others: {
    main: "#6B7280",
    lightBg: "#F3F4F6",
    badge:
      "bg-[#F3F4F6] text-[#6B7280] border-[#6B7280]/30",
    card:
      "bg-[#F3F4F6] hover:border-[#6B7280]/60 hover:shadow-md",
    icon:
      "text-[#6B7280] bg-[#6B7280]/10",
    pill: "bg-[#F3F4F6] text-[#6B7280] border-[#6B7280]/30 shadow-xs font-semibold",
    titleHover: "group-hover:text-[#6B7280]",
    accent: "text-[#6B7280]",
  },
};

/** Fallback style for unknown or missing categories. */
export const CATEGORY_DEFAULT_STYLE = CATEGORY_STYLES["Others"];

/**
 * Returns the approved style for a category.
 * Unknown or missing categories fall back to the "Others" style.
 */
export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? CATEGORY_DEFAULT_STYLE;
}

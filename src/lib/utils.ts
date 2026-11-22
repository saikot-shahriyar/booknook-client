export { cn } from "cn";

/**
 * Formats a date string from the borrow API into a short readable label for
 * book cards and tables (e.g. "Nov 15, 2026"). Returns "—" when the value is
 * missing or not a valid date.
 */
export function formatBorrowDate(value?: string): string {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

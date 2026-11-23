import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  /** Extra classes, e.g. colors or margins. */
  className?: string;
  /** Icon size classes; defaults to `size-4`. */
  size?: string;
  /** When set, the spinner is a `role="status"` element with this label. */
  label?: string;
}

/**
 * Reusable loading spinner: the Lucide `Loader2` icon with `animate-spin`.
 * A spinner next to text is decorative by default (`aria-hidden`); pass
 * `label` when the spinner itself should announce as a status message.
 */
export function Spinner({ className, size = "size-4", label }: SpinnerProps) {
  const classes = cn(size, "animate-spin", className);
  if (label) {
    return <Loader2 className={classes} role="status" aria-label={label} />;
  }
  return <Loader2 className={classes} aria-hidden="true" />;
}

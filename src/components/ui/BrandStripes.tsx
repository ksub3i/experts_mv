import { cx } from "@/lib/utils";

/**
 * Decorative motif drawn from the logomark's upward "arrow" stripes
 * (as used on the vehicle livery). Purely decorative — hidden from AT.
 * Colour follows `currentColor`.
 */
export function BrandStripes({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 134"
      aria-hidden="true"
      className={cx("pointer-events-none", className)}
      fill="currentColor"
    >
      <path d="M0 40 60 0l60 40v22L60 22 0 62Z" />
      <path d="M0 76l60-40 60 40v22L60 58 0 98Z" />
      <path d="M0 112l60-40 60 40v22L60 94 0 134Z" />
    </svg>
  );
}

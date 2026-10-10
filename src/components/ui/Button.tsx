import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { cx } from "@/lib/utils";

type Variant = "primary" | "light" | "outline-light" | "outline-dark";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  light: "bg-paper text-ink hover:bg-surface",
  "outline-light": "border border-paper/70 text-paper hover:bg-paper hover:text-ink",
  "outline-dark": "border border-ink text-ink hover:bg-ink hover:text-paper",
};

export const buttonClasses = (variant: Variant = "primary", className?: string) =>
  cx(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] px-7 py-3",
    "eyebrow !tracking-[0.12em] text-balance transition-colors duration-200 cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
      {arrow && <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />}
    </Link>
  );
}

import { cx } from "@/lib/utils";

export type HeadingLine = { text: string; outline?: boolean };

// Sizes use `cqi` (% of the nearest query container's width — `container-site`
// or an `@container` wrapper) so a 10–11 letter word like "RENOVATION" always fits
// on one line, even in narrow columns and on 320px phones.
const sizes = {
  hero: "text-[length:clamp(2rem,11.5cqi,8rem)]",
  xl: "text-[length:clamp(1.5rem,9cqi,6rem)]",
  lg: "text-[length:clamp(1.75rem,5.5cqi,4rem)]",
  md: "text-[length:clamp(1.25rem,3.5cqi,2.75rem)]",
} as const;

/**
 * Big uppercase display heading. Each line renders on its own row;
 * `outline: true` renders that line as stroked text.
 */
export function DisplayHeading({
  as: Tag = "h2",
  lines,
  size = "lg",
  animate = false,
  className,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  lines: HeadingLine[];
  size?: keyof typeof sizes;
  animate?: boolean;
  className?: string;
}) {
  return (
    <Tag className={cx("display", sizes[size], className)}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={cx("block", line.outline && "text-outline", animate && "motion-safe:animate-rise")}
          style={animate ? { animationDelay: `${120 + i * 140}ms` } : undefined}
        >
          {line.text}
        </span>
      ))}
    </Tag>
  );
}

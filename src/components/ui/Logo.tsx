import Image from "next/image";
import { cx } from "@/lib/utils";

/**
 * Official master logo files (public/brand, copied from /Logos).
 * Per the guidelines: never redraw or recolour; use full colour on white/light,
 * reversed (red mark, white name) on navy/dark, one-colour white on red or photos.
 * Minimum primary width is 140px.
 */
const files = {
  "full-colour": "/brand/primary_full-colour.svg",
  reversed: "/brand/primary_reversed.svg",
  white: "/brand/primary_white.svg",
} as const;

export function Logo({
  variant = "full-colour",
  alt = "The Experts",
  className,
  priority = false,
}: {
  variant?: keyof typeof files;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={files[variant]}
      alt={alt}
      width={658}
      height={126}
      unoptimized
      preload={priority}
      className={cx("h-auto w-[180px] md:w-[210px]", className)}
    />
  );
}

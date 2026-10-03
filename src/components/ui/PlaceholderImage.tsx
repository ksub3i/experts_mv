import Image from "next/image";
import { ImageIcon } from "@phosphor-icons/react/ssr";
import type { Media } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * Renders `media.src` with next/image when a real photo exists, otherwise a
 * labelled placeholder block. Swap in photography by adding `src` to content.
 *
 * - `fill`: covers its positioned parent (heroes, full-bleed backgrounds).
 * - otherwise `ratio` reserves space (e.g. "4/5") to avoid layout shift.
 */
export function PlaceholderImage({
  media,
  fill = false,
  ratio = "4/3",
  sizes = "100vw",
  priority = false,
  tone = "light",
  className,
}: {
  media: Media;
  fill?: boolean;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const box = fill ? "absolute inset-0" : "relative w-full";
  const style = fill ? undefined : { aspectRatio: ratio };

  if (media.src) {
    return (
      <div className={cx(box, "overflow-hidden", className)} style={style}>
        <Image src={media.src} alt={media.alt} fill sizes={sizes} preload={priority} className="object-cover" />
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <div
      {...(media.alt ? { role: "img", "aria-label": media.alt } : { "aria-hidden": true })}
      className={cx(
        box,
        "flex overflow-hidden",
        // Full-bleed backgrounds carry text, so tuck the label into the top-right corner.
        fill ? "items-start justify-end pt-24 pr-4" : "items-center justify-center",
        dark ? "bg-ink-soft text-muted-inverse" : "bg-placeholder text-placeholder-ink",
        className,
      )}
      style={{
        ...style,
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 22px, rgb(255 255 255 / 0.05) 22px 23px)",
      }}
    >
      <span className="flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon size={28} weight="light" aria-hidden="true" />
        {media.label && <span className="eyebrow !text-[0.6875rem] opacity-80">{media.label}</span>}
      </span>
    </div>
  );
}

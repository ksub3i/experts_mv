import type { Media } from "@/lib/types";
import { DisplayHeading, type HeadingLine } from "@/components/ui/DisplayHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

/** Full-bleed photo hero used by inner pages (About, project detail). */
export function PageHero({
  lines,
  eyebrow,
  subtitle,
  media,
}: {
  lines: HeadingLine[];
  eyebrow?: string;
  subtitle?: string;
  media: Media;
}) {
  return (
    <section className="on-dark relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink text-paper [--outline:var(--color-paper)]">
      <PlaceholderImage media={media} fill priority tone="dark" className="-z-10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/40" />
      <div className="container-site pt-32 pb-16 md:pb-20">
        {eyebrow && <p className="eyebrow mb-5 text-highlight motion-safe:animate-rise">{eyebrow}</p>}
        <DisplayHeading as="h1" size="xl" animate lines={lines} />
        {subtitle && (
          <p className="eyebrow mt-6 text-base motion-safe:animate-rise" style={{ animationDelay: "420ms" }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ButtonLink } from "@/components/ui/Button";
import { images } from "@/content/images";

export function HomeHero({ estimateHref }: { estimateHref: string }) {
  return (
    <section className="on-dark relative isolate flex min-h-dvh items-end overflow-hidden bg-ink text-paper [--outline:var(--color-paper)]">
      {/* Swap for a hero photo or a muted, looping <video>. */}
      <PlaceholderImage
        media={images.homeHero}
        fill
        priority
        tone="dark"
        className="-z-10"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/30" />

      <div className="container-site pt-32 pb-20 md:pb-28">
        <DisplayHeading
          as="h1"
          size="hero"
          animate
          lines={[{ text: "Build" }, { text: "Renovate", outline: true }, { text: "Create." }]}
        />
        <p className="eyebrow mt-6 text-base text-highlight motion-safe:animate-rise" style={{ animationDelay: "560ms" }}>
          Built by experts · Malé &amp; Hulhumalé
        </p>
        <div className="mt-10 flex flex-wrap gap-4 motion-safe:animate-rise" style={{ animationDelay: "680ms" }}>
          <ButtonLink href={estimateHref} arrow>
            Get Your Free Project Estimate
          </ButtonLink>
          <ButtonLink href="/gallery" variant="outline-light">
            View our work
          </ButtonLink>
        </div>
      </div>

      <CaretDownIcon
        size={28}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 opacity-70 motion-safe:animate-bounce md:block"
      />
    </section>
  );
}

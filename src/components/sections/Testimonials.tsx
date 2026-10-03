import { QuotesIcon } from "@phosphor-icons/react/ssr";
import type { Testimonial } from "@/lib/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Slider, SliderControls } from "@/components/ui/Slider";
import { images } from "@/content/images";

/** Quote card over a full-bleed project photo, with prev/next controls. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const slides = testimonials.map((t) => (
    <figure key={t.id} className="@container relative max-w-xl bg-paper px-8 pt-12 pb-20 text-center shadow-[var(--shadow-card-hover)] md:px-12">
      <QuotesIcon size={44} weight="fill" className="mx-auto text-accent" aria-hidden="true" />
      <p className="display mt-4 text-[length:clamp(1.25rem,8.5cqi,2.75rem)]">{t.headline}</p>
      <blockquote className="mt-6 text-sm leading-relaxed text-muted">
        <p>&ldquo;{t.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="eyebrow mt-8 text-ink">
        — {t.author}
        {t.location && <span className="text-muted">, {t.location}</span>}
      </figcaption>
      <SliderControls className="absolute right-0 bottom-0" />
    </figure>
  ));

  return (
    <section aria-label="Client testimonials" className="relative isolate overflow-hidden bg-ink py-20 md:py-28">
      <PlaceholderImage media={images.testimonials} fill tone="dark" className="-z-10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />
      <div className="container-site">
        <Slider slides={slides} label="Client testimonials" />
      </div>
    </section>
  );
}

import type { Service } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Slider, SliderControls } from "@/components/ui/Slider";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Full-bleed service detail slider. Each slide is deep-linkable via
 * `/services#service-<slug>` (used by service cards and the footer).
 */
export function ServiceSlider({ services, estimateHref }: { services: Service[]; estimateHref: string }) {
  const slides = services.map((s) => (
    <article key={s.slug} className="relative isolate flex min-h-[44rem] items-center bg-ink py-20">
      <PlaceholderImage media={s.image} fill tone="dark" className="-z-10" />
      <div className="container-site">
        <div className="@container relative max-w-xl bg-paper p-8 pb-20 shadow-[var(--shadow-card-hover)] md:p-12 md:pb-24">
          <Icon name={s.icon} size={48} className="text-ink" />
          <h2 className="display mt-6 text-[length:clamp(1.25rem,8.5cqi,2.75rem)]">{s.title}</h2>
          <p className="mt-6 leading-relaxed text-muted">{s.description}</p>
          <ButtonLink href={estimateHref} arrow className="mt-8">
            Get Your Free Estimate
          </ButtonLink>
          <SliderControls className="absolute right-0 bottom-0" />
        </div>
      </div>
    </article>
  ));

  return (
    <Slider
      slides={slides}
      label="Service details"
      ids={services.map((s) => `service-${s.slug}`)}
    />
  );
}

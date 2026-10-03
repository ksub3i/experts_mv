import type { Stat } from "@/lib/types";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { StatCounter } from "@/components/ui/StatCounter";
import { ButtonLink } from "@/components/ui/Button";
import { BrandStripes } from "@/components/ui/BrandStripes";
import { images } from "@/content/images";

/** Full-bleed photo with "Meet the team" copy on the left and stats on the right. */
export function TeamFeature({ stats }: { stats: Stat[] }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-paper [--outline:var(--color-paper)]">
      <PlaceholderImage media={images.homeTeam} fill tone="dark" className="-z-10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/60" />
      <BrandStripes className="absolute -right-10 -bottom-16 hidden h-72 w-72 text-brand-red/15 lg:block" />

      <div className="container-site grid gap-14 py-24 md:py-32 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <DisplayHeading
            size="xl"
            lines={[{ text: "Meet the" }, { text: "Experts", outline: true }, { text: "Team" }]}
          />
          <p className="mt-8 max-w-xl leading-relaxed text-muted-inverse">
            With 40 years of combined experience and 200 completed projects, we&apos;ve built our name on open
            communication, transparency and superior craftsmanship. We explain clearly, promise only what we can
            deliver and always follow through.
          </p>
          <ButtonLink href="/about" variant="outline-light" className="mt-10">
            Our story
          </ButtonLink>
        </div>

        <ul className="grid gap-10 text-center sm:auto-cols-fr sm:grid-flow-col lg:grid-flow-row lg:border-l lg:border-paper/25 lg:pl-14">
          {stats.map((stat) => (
            <li key={stat.label}>
              <StatCounter stat={stat} labelClassName="text-highlight" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

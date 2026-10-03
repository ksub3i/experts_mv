import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { images } from "@/content/images";

/** "Our story" — offset photo collage alongside the story and mission/vision. */
export function OriginStory({ mission, vision }: { mission: string; vision: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site">
        <p className="eyebrow text-accent">Our story</p>
        <h2 className="display mt-4 max-w-4xl text-[clamp(2rem,4.5vw,3.5rem)] text-ink">
          Better homes, built with care — one project at a time.
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: team photo (square, matches the supplied image) */}
          <PlaceholderImage media={images.storyMain} ratio="1/1" sizes="(min-width: 768px) 45vw, 100vw" />

          {/* Right: story copy, then mission & vision */}
          <div className="flex flex-col gap-10 md:pt-10">
            <div className="space-y-5 leading-relaxed text-muted">
              <p>
                The Experts is a home services company based in Malé, serving homes across Malé and Hulhumalé. From small repairs to full interior and
                exterior renovations, we give every project the same care and attention to detail.
              </p>
              <p>
                With 40 years of combined experience and 200 completed projects, we&apos;ve built our name on open
                communication, transparency and superior craftsmanship. Our goal is simple: to turn your house into
                the home you&apos;ve always imagined.
              </p>
            </div>

            <dl className="grid gap-px overflow-hidden bg-line sm:grid-cols-2">
              {[
                ["Our mission", mission],
                ["Our vision", vision],
              ].map(([term, text]) => (
                <div key={term} className="bg-surface p-6">
                  <dt className="eyebrow text-accent">{term}</dt>
                  <dd className="mt-3 leading-relaxed text-ink">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

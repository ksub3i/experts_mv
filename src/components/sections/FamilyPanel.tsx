import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BrandStripes } from "@/components/ui/BrandStripes";
import { images } from "@/content/images";

/** Photo overlapping a navy panel — "A team you can count on." */
export function FamilyPanel() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site">
        <div className="relative grid lg:grid-cols-12 lg:items-center">
          <div className="relative z-10 lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <PlaceholderImage
              media={images.familyPanel}
              ratio="4/3"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="shadow-[var(--shadow-card-hover)]"
            />
          </div>

          <div className="on-dark relative -mt-10 overflow-hidden bg-ink px-6 pt-20 pb-12 text-paper sm:px-12 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-0 lg:py-24 lg:pr-16 lg:pl-[calc(100%/8+3rem)]">
            <BrandStripes className="absolute -top-8 -right-8 h-40 w-40 text-brand-red" />
            <h2 className="display relative text-[clamp(2rem,4.5vw,3.5rem)]">
              A team you can{" "}
              <span className="relative inline-block">
                count
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-brand-red"
                >
                  <path d="M2 9c30-6 80-8 116-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              on.
            </h2>
            <p className="relative mt-8 max-w-xl leading-relaxed text-muted-inverse">
              We sound like what we are: a trusted expert in your home. We&apos;re open about cost, time and
              process, quick to respond, and respectful of your home and your vision — so you always know where
              your project stands, from the first visit to the final finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

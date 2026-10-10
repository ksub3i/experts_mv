import type { Metadata } from "next";
import { PhoneIcon, DeviceMobileIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import { getSite } from "@/lib/content";
import { buttonClasses } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: "Call The Experts for a free, no-obligation quote for your renovation in Malé and Hulhumalé.",
};

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export default async function ContactPage() {
  const site = await getSite();
  const link = "inline-flex min-h-11 items-center gap-3 font-semibold text-ink hover:text-accent";
  const icon = "shrink-0 text-accent";

  return (
    <section className="pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <p className="eyebrow text-accent">Free, no-obligation quote</p>
          <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4.5rem)] text-ink">Inquire for your free quote</h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Call us to talk through your project and we&apos;ll give you clear next steps — no jargon, no surprises.
            You&apos;re also welcome to visit us.
          </p>
          <ul className="mt-8 space-y-1">
            <li>
              <a href={tel(site.phone)} className={link}>
                <PhoneIcon size={22} className={icon} aria-hidden="true" />
                <span className="sr-only">Telephone:</span> {site.phone}
              </a>
            </li>
            <li>
              <a href={tel(site.mobile)} className={link}>
                <DeviceMobileIcon size={22} className={icon} aria-hidden="true" />
                <span className="sr-only">Mobile:</span> {site.mobile}
              </a>
            </li>
            <li className="flex min-h-11 items-start gap-3 pt-2.5 font-semibold">
              <MapPinIcon size={22} className={icon} aria-hidden="true" />
              <span>
                {site.address}
                <br />
                <span className="font-normal text-muted">Serving {site.serviceArea}</span>
              </span>
            </li>
          </ul>
          <div className="mt-12 hidden lg:block">
            <PlaceholderImage media={images.contact} ratio="4/3" sizes="35vw" />
          </div>
        </div>

        <div className="lg:pt-4">
          <div className="border border-line bg-surface p-6 sm:p-10">
            <h2 className="display text-[clamp(1.5rem,3vw,2.25rem)] text-ink">Call us for your free quote</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              Online enquiries are temporarily unavailable. Please call us — we&apos;ll talk through your project and
              arrange a convenient time to visit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={tel(site.phone)} className={buttonClasses("primary")}>
                <PhoneIcon size={18} weight="bold" aria-hidden="true" /> Call {site.phone}
              </a>
              <a href={tel(site.mobile)} className={buttonClasses("outline-dark")}>
                <DeviceMobileIcon size={18} weight="bold" aria-hidden="true" /> Call {site.mobile}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

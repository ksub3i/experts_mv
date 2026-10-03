import type { Metadata } from "next";
import { EnvelopeSimpleIcon, PhoneIcon, DeviceMobileIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import { getSite } from "@/lib/content";
import { QuoteForm } from "@/features/quote/QuoteForm";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: "Tell us about your project and get a free, no-obligation quote from The Experts in Malé and Hulhumalé.",
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
            Tell us about your project and we&apos;ll get back to you with clear next steps — no jargon, no
            surprises. Prefer to talk? Call or visit us.
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
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                <EnvelopeSimpleIcon size={22} className={icon} aria-hidden="true" />
                {site.email}
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
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

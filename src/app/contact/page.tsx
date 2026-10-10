import type { Metadata } from "next";
import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  DeviceMobileIcon,
  MapPinIcon,
  ClipboardTextIcon,
  CalendarCheckIcon,
  CheckIcon,
} from "@phosphor-icons/react/ssr";
import { getSite } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { BrandStripes } from "@/components/ui/BrandStripes";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, email or visit The Experts in Malé — or get a free project estimate online for your renovation in Malé or Hulhumalé.",
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
          <p className="eyebrow text-accent">Contact us</p>
          <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4.5rem)] text-ink">Let&apos;s talk about your project</h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Call, email or visit us — we&apos;re happy to help. For a free estimate, the quickest way is our short
            online questionnaire.
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
          <div className="@container on-dark relative overflow-hidden bg-ink p-8 text-paper sm:p-10">
            <BrandStripes className="absolute -top-10 -right-10 h-44 w-44 text-brand-red/25" />
            <ClipboardTextIcon size={44} weight="light" className="relative text-highlight" aria-hidden="true" />
            <h2 className="display relative mt-6 text-[length:clamp(1.75rem,7cqi,2.75rem)]">
              Get your free estimate
            </h2>
            <p className="relative mt-5 max-w-lg leading-relaxed text-muted-inverse">
              Answer a few quick questions about your project, add photos if you have them, then pick a time for a
              free consultation — all in about 3 minutes.
            </p>
            <ul className="relative mt-6 space-y-3">
              {["Free and no obligation", "Upload photos and floor plans", "Book your consultation online"].map((p) => (
                <li key={p} className="flex items-center gap-3 text-muted-inverse">
                  <CheckIcon size={18} weight="bold" className="shrink-0 text-brand-red" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href={site.estimateHref} arrow className="relative mt-10">
              {site.ctaLabel}
            </ButtonLink>
            <p className="relative mt-6 flex items-center gap-2 text-sm text-muted-inverse">
              <CalendarCheckIcon size={18} className="text-highlight" aria-hidden="true" />
              Choose your consultation time at the end.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

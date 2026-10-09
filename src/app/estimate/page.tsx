import type { Metadata } from "next";
import { CheckIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { getSite } from "@/lib/content";
import { EstimateLoader } from "@/features/estimate/EstimateLoader";
import { BrandStripes } from "@/components/ui/BrandStripes";

export const metadata: Metadata = {
  title: "Get Your Free Project Estimate",
  description:
    "Answer a few quick questions about your renovation in Malé or Hulhumalé, then book a free consultation with The Experts.",
};

const promises = [
  "Free and no obligation",
  "Takes about 3 minutes",
  "Book your consultation straight away",
  "Clear, honest pricing — no surprises",
];

export default async function EstimatePage() {
  const site = await getSite();
  const tel = `tel:${site.phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="bg-surface pt-28 pb-20 md:pt-32 md:pb-28">
      {/* On the booking step (data-step="booking") the side panel hides so the calendar gets the full width. */}
      <div className="group/estimate container-site grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start lg:gap-10 lg:has-[[data-step=booking]]:grid-cols-1">
        {/* Intro panel */}
        <aside className="@container on-dark relative overflow-hidden bg-ink p-6 text-paper sm:p-8 lg:sticky lg:top-28 group-has-[[data-step=booking]]/estimate:hidden">
          <BrandStripes className="absolute -right-8 -bottom-10 h-40 w-40 text-brand-red/25" />
          <p className="eyebrow relative text-highlight">Malé &amp; Hulhumalé</p>
          <h1 className="display relative mt-4 text-[length:clamp(1.75rem,9cqi,2.75rem)]">
            Get your free project estimate
          </h1>
          <ul className="relative mt-8 hidden space-y-3 lg:block">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-3 text-muted-inverse">
                <CheckIcon size={20} weight="bold" className="mt-0.5 shrink-0 text-brand-red" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="relative mt-6 border-t border-line-inverse pt-4 lg:mt-10 lg:pt-6">
            <p className="text-sm text-muted-inverse">Prefer to talk it through?</p>
            <a href={tel} className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold hover:text-highlight">
              <PhoneIcon size={20} className="text-brand-red" aria-hidden="true" />
              {site.phone}
            </a>
          </div>
        </aside>

        {/* Questionnaire */}
        <div className="@container bg-paper p-6 shadow-[var(--shadow-card)] sm:p-10">
          <EstimateLoader phone={site.phone} />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getFaqGroups, getSite } from "@/lib/content";
import { FaqList } from "@/components/sections/FaqList";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about free estimates, pricing, timelines, permits, materials and guarantees for home renovations in Malé and Hulhumalé.",
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default async function FaqPage() {
  const [site, groups] = await Promise.all([getSite(), getFaqGroups()]);

  // Structured data so search engines can show answers directly in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      // Draft answers (with [placeholders]) are left out until confirmed.
      g.items.filter((i) => !i.draft).map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="container-site">
          <p className="eyebrow text-accent">FAQ</p>
          <h1 className="display mt-4 max-w-4xl text-[length:clamp(1.75rem,8cqi,4.5rem)] text-ink">
            Frequently asked questions
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            Everything you need to know about working with The Experts in Malé and Hulhumalé. Still have a question?
            Call us on{" "}
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-ink underline">
              {site.phone}
            </a>
            .
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
            <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow mb-4 text-muted">Topics</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {groups.map((g) => (
                  <li key={g.title}>
                    <Link
                      href={`#${slug(g.title)}`}
                      className="inline-flex min-h-11 items-center border border-line px-4 text-sm font-semibold text-ink hover:border-ink lg:border-0 lg:px-0 lg:hover:text-accent"
                    >
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-14">
              {groups.map((g) => (
                <section key={g.title} id={slug(g.title)} aria-labelledby={`${slug(g.title)}-h`} className="scroll-mt-28">
                  <h2 id={`${slug(g.title)}-h`} className="display mb-4 text-2xl text-ink">
                    {g.title}
                  </h2>
                  <FaqList items={g.items} />
                </section>
              ))}

              <div className="bg-ink p-8 text-paper sm:p-10">
                <h2 className="display text-[clamp(1.5rem,3vw,2.25rem)]">Ready to start your project?</h2>
                <p className="mt-4 max-w-xl text-muted-inverse">
                  Tell us what you have in mind and book a free consultation — it takes about 3 minutes.
                </p>
                <ButtonLink href={site.estimateHref} arrow className="mt-8">
                  {site.ctaLabel}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

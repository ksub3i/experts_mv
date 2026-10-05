import type { FaqItem } from "@/content/faq";
import { FaqList } from "./FaqList";
import { ButtonLink } from "@/components/ui/Button";

/** Homepage FAQ: the most common questions, linking to the full /faq page. */
export function FaqTeaser({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <p className="eyebrow text-accent">FAQ</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] text-ink">Questions? We&apos;ve got answers.</h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            The things our customers ask most often. Can&apos;t find what you need? Get in touch — we&apos;re happy to
            help.
          </p>
          <ButtonLink href="/faq" variant="outline-dark" className="mt-10">
            See all questions
          </ButtonLink>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}

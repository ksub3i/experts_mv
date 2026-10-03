import type { Service } from "@/lib/types";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";

export function ServicesIntro({ services, serviceArea }: { services: Service[]; serviceArea: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site text-center">
        <p className="eyebrow text-accent">Home services &amp; renovations in</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.5rem)] text-ink">{serviceArea}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">
          From small repairs to full interior and exterior renovations, we give every project the same care and
          attention to detail. Our goal is simple: to turn your house into the home you&apos;ve always imagined.
        </p>

        <ul className="mt-14 grid gap-6 text-left md:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>

        <ButtonLink href="/services" className="mt-14">
          View all services
        </ButtonLink>
      </div>
    </section>
  );
}

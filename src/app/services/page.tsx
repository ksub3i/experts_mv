import type { Metadata } from "next";
import { getServices, getSite } from "@/lib/content";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ServiceSlider } from "@/components/sections/ServiceSlider";

export const metadata: Metadata = {
  title: "Renovation Services",
  description: "Interior and exterior renovation, kitchens and bathrooms, repairs and project management in Malé and Hulhumalé.",
};

export default async function ServicesPage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  return (
    <>
      <section className="on-dark bg-ink pt-40 pb-40 text-paper [--outline:var(--color-paper)] md:pb-48">
        <div className="container-site">
          <p className="eyebrow text-highlight motion-safe:animate-rise">Serving {site.serviceArea}</p>
          <DisplayHeading
            as="h1"
            size="xl"
            animate
            className="mt-5"
            lines={[{ text: "Renovation" }, { text: "Services", outline: true }]}
          />
        </div>
      </section>

      <section aria-label="All services" className="pb-20 md:pb-28">
        <ul className="container-site -mt-28 grid gap-6 sm:grid-cols-2 md:-mt-32 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>

      <ServiceSlider services={services} estimateHref={site.estimateHref} />
    </>
  );
}

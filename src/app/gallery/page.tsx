import type { Metadata } from "next";
import { getProjects, getSite, getTestimonials } from "@/lib/content";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Testimonials } from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Interior, exterior and commercial renovation projects by The Experts in Malé and Hulhumalé.",
};

export default async function GalleryPage() {
  const [site, projects, testimonials] = await Promise.all([getSite(), getProjects(), getTestimonials()]);

  // Staggered two-column layout: the intro heads the left column, the right column starts lower.
  const left = projects.filter((_, i) => i % 2 === 1);
  const right = projects.filter((_, i) => i % 2 === 0);

  return (
    <>
      <section className="pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="container-site grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col gap-8 md:gap-10">
            {/* Container query: the heading scales with this column, so "Renovation" never splits. */}
            <header className="@container md:pb-6">
              <p className="eyebrow mb-4 text-accent">Our work</p>
              <h1 className="display text-[length:clamp(1.75rem,10cqi,4.5rem)] text-ink">Our renovation projects</h1>
              <p className="mt-6 max-w-md leading-relaxed text-muted">
                Real projects, from small repairs to full interior and exterior renovations — each given the same
                care and attention to detail. Serving {site.serviceArea}.
              </p>
            </header>
            {left.map((p) => (
              <ProjectCard key={p.slug} project={p} showSummary />
            ))}
          </div>
          <div className="flex flex-col gap-8 md:gap-10">
            {right.map((p) => (
              <ProjectCard key={p.slug} project={p} showSummary />
            ))}
          </div>
        </div>
      </section>
      <Testimonials testimonials={testimonials} />
    </>
  );
}

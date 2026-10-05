import {
  getFeaturedProjects,
  getPartners,
  getServices,
  getSite,
  getStats,
  getTestimonials,
  getFeaturedFaqs,
} from "@/lib/content";
import { HomeHero } from "@/components/sections/HomeHero";
import { ServicesIntro } from "@/components/sections/ServicesIntro";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { TeamFeature } from "@/components/sections/TeamFeature";
import { ProjectTeaser } from "@/components/sections/ProjectTeaser";
import { FamilyPanel } from "@/components/sections/FamilyPanel";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqTeaser } from "@/components/sections/FaqTeaser";

export default async function HomePage() {
  const [site, services, partners, stats, projects, testimonials, faqs] = await Promise.all([
    getSite(),
    getServices(),
    getPartners(),
    getStats("home"),
    getFeaturedProjects(),
    getTestimonials(),
    getFeaturedFaqs(),
  ]);

  return (
    <>
      <HomeHero estimateHref={site.estimateHref} />
      <ServicesIntro services={services.slice(0, 3)} serviceArea={site.serviceArea} />
      <PartnerStrip partners={partners} />
      <TeamFeature stats={stats} />
      <ProjectTeaser projects={projects.slice(0, 2)} />
      <FamilyPanel />
      <Testimonials testimonials={testimonials} />
      <FaqTeaser items={faqs} />
    </>
  );
}

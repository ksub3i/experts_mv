import {
  getFeaturedProjects,
  getPartners,
  getServices,
  getSite,
  getStats,
  getTestimonials,
} from "@/lib/content";
import { HomeHero } from "@/components/sections/HomeHero";
import { ServicesIntro } from "@/components/sections/ServicesIntro";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { TeamFeature } from "@/components/sections/TeamFeature";
import { ProjectTeaser } from "@/components/sections/ProjectTeaser";
import { FamilyPanel } from "@/components/sections/FamilyPanel";
import { Testimonials } from "@/components/sections/Testimonials";

export default async function HomePage() {
  const [site, services, partners, stats, projects, testimonials] = await Promise.all([
    getSite(),
    getServices(),
    getPartners(),
    getStats("home"),
    getFeaturedProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <HomeHero quoteHref={site.quoteHref} />
      <ServicesIntro services={services.slice(0, 3)} serviceArea={site.serviceArea} />
      <PartnerStrip partners={partners} />
      <TeamFeature stats={stats} />
      <ProjectTeaser projects={projects.slice(0, 2)} />
      <FamilyPanel />
      <Testimonials testimonials={testimonials} />
    </>
  );
}

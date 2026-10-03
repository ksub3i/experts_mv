import type { Service } from "@/lib/types";
import { images } from "./images";

// DRAFT — service list drafted from the brand guidelines ("from small repairs to full
// interior and exterior renovations"). Please review names and copy.
const base: Omit<Service, "image">[] = [
  {
    slug: "interior-renovation",
    title: "Interior Renovation",
    icon: "renovation",
    summary: "Full interior makeovers — layouts, flooring, ceilings, lighting and finishes.",
    description:
      "From a single room to a whole home, we plan and deliver interior renovations that turn your house into the home you've always imagined. You get one team, a clear scope and honest timelines from the first visit to the final finish.",
  },
  {
    slug: "exterior-renovation",
    title: "Exterior Renovation & Painting",
    icon: "exterior",
    summary: "Facades, waterproofing, painting and outdoor spaces built to last.",
    description:
      "Island weather is tough on buildings. We repair, waterproof and repaint exteriors with materials chosen for the climate, and we leave every site clean and tidy at the end of each day.",
  },
  {
    slug: "kitchens-bathrooms",
    title: "Kitchens & Bathrooms",
    icon: "kitchen",
    summary: "Practical, beautiful kitchens and bathrooms — designed, fitted and finished.",
    description:
      "Kitchens and bathrooms take the most planning. We coordinate plumbing, electrical, tiling and joinery so the work runs in the right order and finishes on time, with no surprises on cost.",
  },
  {
    slug: "repairs-maintenance",
    title: "Repairs & Maintenance",
    icon: "repairs",
    summary: "Small jobs done properly — fixes, fittings and upkeep for homes and businesses.",
    description:
      "No job is too small. Whether it's a leak, a broken fitting or ongoing upkeep, we respond quickly, explain the fix clearly and do it right the first time.",
  },
  {
    slug: "project-management",
    title: "Project Management",
    icon: "management",
    summary: "One point of contact for your whole project, from planning to handover.",
    description:
      "We manage trades, materials, budget and schedule so you don't have to. You get regular updates and full transparency on cost, time and progress, from first visit to final walkthrough.",
  },
];

export const services: Service[] = base.map((s) => ({
  ...s,
  image: images.services[s.slug as keyof typeof images.services],
}));

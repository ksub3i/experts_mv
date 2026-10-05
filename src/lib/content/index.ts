/**
 * Content repository — the ONLY way pages read content.
 *
 * Today these read the static files in `src/content`. To move to a CMS,
 * re-implement these functions against the CMS API; keep the signatures
 * (they are already async) and no page or component needs to change.
 */
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { faqGroups, allFaqs } from "@/content/faq";
import { site, homeStats, aboutStats, companyValues, partners, mission, vision } from "@/content/site";
import type { Project, Service, Testimonial } from "@/lib/types";

export async function getSite() {
  return site;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getStats(page: "home" | "about") {
  return page === "home" ? homeStats : aboutStats;
}

export async function getCompanyValues() {
  return companyValues;
}

export async function getMissionVision() {
  return { mission, vision };
}

export async function getPartners() {
  return partners;
}

export async function getFaqGroups() {
  return faqGroups;
}

export async function getFeaturedFaqs() {
  return allFaqs.filter((f) => f.featured);
}

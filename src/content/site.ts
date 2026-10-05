import type { SiteConfig, Stat, CompanyValue } from "@/lib/types";

// Source: Brand Guidelines v1.0 (2026). Items marked PLACEHOLDER were not in the guidelines.
export const site: SiteConfig = {
  name: "The Experts",
  tagline: "Built by experts",
  description:
    "The Experts is a home services company serving Malé and Hulhumalé. From small repairs to full interior and exterior renovations, we give every project the same care and attention to detail.",
  serviceArea: "Malé & Hulhumalé",
  address: "H. Saleena, Galadhun Goalhi, Malé 20014",
  email: "hello@example.com", // PLACEHOLDER — not in the brand guidelines
  phone: "+960 402 2420",
  mobile: "+960 914 2236",
  socials: [
    { network: "facebook", label: "Facebook", handle: "TheExpertsMv", href: "https://www.facebook.com/TheExpertsMv" },
    { network: "instagram", label: "Instagram", handle: "@experts.mv", href: "https://www.instagram.com/experts.mv" },
    { network: "x", label: "X", handle: "@experts.mv", href: "https://x.com/experts.mv" },
    { network: "tiktok", label: "TikTok", handle: "@experts.mv", href: "https://www.tiktok.com/@experts.mv" },
  ],
  nav: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Our Work", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  estimateHref: "/estimate",
  ctaLabel: "Get Your Free Project Estimate",
};

// Layouts adapt to any number of stats — add more (e.g. crew size) once confirmed.
export const homeStats: Stat[] = [
  { value: 40, suffix: "+", label: "Years of combined experience" },
  { value: 200, suffix: "+", label: "Projects completed" },
];

export const aboutStats: Stat[] = homeStats;

export const companyValues: CompanyValue[] = [
  {
    icon: "resilience",
    title: "Resilience",
    text: "When the unexpected happens, we adapt fast and find a way to keep your project on track.",
  },
  {
    icon: "preparation",
    title: "Preparation",
    text: "We arrive with the right people, tools and plan, so work runs smoothly from day one.",
  },
  {
    icon: "growth",
    title: "Growth",
    text: "We keep improving our people, our tools and our methods — project after project.",
  },
];

export const mission =
  "To elevate every home we touch through expert craftsmanship and smart, innovative solutions.";
export const vision =
  "To be the most trusted name in home renovation in the Maldives — known for integrity, innovation and teamwork.";

// PLACEHOLDER — replace each with the partner's logo.
export const partners = Array.from({ length: 6 }, (_, i) => ({
  name: `Partner ${i + 1}`,
}));

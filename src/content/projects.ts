import type { Project } from "@/lib/types";
import { projectPhotos } from "./images";

type Base = Omit<Project, "cover" | "gallery">;

// PLACEHOLDER — sample projects with stock photos. Replace with real work (names, locations, photos).
const base: Base[] = [
  {
    slug: "sample-villa",
    title: "Sample",
    titleAccent: "Villa",
    location: "Malé",
    category: "Interior renovation",
    summary: "Placeholder — full interior renovation with a new layout, flooring and lighting throughout.",
    featured: true,
  },
  {
    slug: "sample-apartment",
    title: "Sample",
    titleAccent: "Apartment",
    location: "Hulhumalé",
    category: "Kitchen & bathroom",
    summary: "Placeholder — kitchen and two bathrooms remodelled, with new tiling and fixtures.",
    featured: true,
  },
  {
    slug: "sample-guesthouse",
    title: "Sample",
    titleAccent: "Guesthouse",
    location: "[Island]",
    category: "Exterior renovation",
    summary: "Placeholder — facade repairs, waterproofing and a full exterior repaint.",
  },
  {
    slug: "sample-cafe",
    title: "Sample",
    titleAccent: "Café",
    location: "Malé",
    category: "Commercial fit-out",
    summary: "Placeholder — commercial interior fit-out delivered around the owner's opening date.",
  },
  {
    slug: "sample-townhouse",
    title: "Sample",
    titleAccent: "Townhouse",
    location: "Malé",
    category: "Full renovation",
    summary: "Placeholder — full renovation across three floors, inside and out.",
  },
  {
    slug: "sample-residence",
    title: "Sample",
    titleAccent: "Residence",
    location: "Hulhumalé",
    category: "Exterior painting",
    summary: "Placeholder — exterior painting with climate-suited coatings and new balcony railings.",
  },
  {
    slug: "sample-office",
    title: "Sample",
    titleAccent: "Office",
    location: "Malé",
    category: "Repairs & maintenance",
    summary: "Placeholder — ongoing maintenance and repairs for a busy office building.",
  },
];

export const projects: Project[] = base.map((p) => ({
  ...p,
  ...projectPhotos(p.slug, `${p.title} ${p.titleAccent}`),
}));

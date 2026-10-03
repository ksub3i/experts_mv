/**
 * Content model. Kept plain and serializable so the static files in
 * `src/content` can later be replaced by a headless CMS without touching UI.
 */

/** Icon keys resolve to SVG icons in `components/ui/Icon.tsx`. */
export type IconKey =
  | "management"
  | "renovation"
  | "kitchen"
  | "exterior"
  | "repairs"
  | "bathroom"
  | "resilience"
  | "preparation"
  | "growth"
  | "family";

/** Describes an image slot. `src` is empty until real photography arrives. */
export type Media = {
  src?: string;
  alt: string;
  /** Label shown on the placeholder, e.g. "Hero — 1920×1080". */
  label?: string;
  width?: number;
  height?: number;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: IconKey;
  image: Media;
};

export type Project = {
  slug: string;
  /** Title split so the second line can render in the outline style. */
  title: string;
  titleAccent: string;
  location: string;
  category: string;
  summary: string;
  cover: Media;
  gallery: Media[];
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  headline: string;
  quote: string;
  author: string;
  location?: string;
};

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export type CompanyValue = {
  title: string;
  text: string;
  icon: IconKey;
};

export type NavItem = { label: string; href: string };

export type SocialLink = {
  network: "facebook" | "instagram" | "x" | "tiktok";
  label: string;
  handle: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  serviceArea: string;
  address: string;
  email: string;
  phone: string;
  mobile: string;
  socials: SocialLink[];
  nav: NavItem[];
  quoteHref: string;
};

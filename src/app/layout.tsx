import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { getServices, getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { CtaBand } from "@/components/layout/CtaBand";
import { Footer } from "@/components/layout/Footer";

// Display headings: Archivo (expanded, uppercase) — kept by choice for the headline style.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

// Body: General Sans, the brand typeface (Brand Guidelines §04), self-hosted from src/fonts.
const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  src: [
    { path: "../fonts/GeneralSans-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/GeneralSans-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-Semibold.otf", weight: "600", style: "normal" },
    { path: "../fonts/GeneralSans-Bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "The Experts | Home Renovation & Repairs in Malé & Hulhumalé",
    template: "%s | The Experts",
  },
  description:
    "The Experts is a home services company serving Malé and Hulhumalé. From small repairs to full interior and exterior renovations, we give every project the same care and attention to detail.",
};

export const viewport: Viewport = {
  themeColor: "#0f2242",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  return (
    <html lang="en" className={`${archivo.variable} ${generalSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="eyebrow sr-only z-50 bg-accent px-5 py-3 text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <Header nav={site.nav} quoteHref={site.quoteHref} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <CtaBand href={site.quoteHref} />
        <Footer site={site} services={services} />
      </body>
    </html>
  );
}

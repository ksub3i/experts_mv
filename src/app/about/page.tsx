import type { Metadata } from "next";
import { getCompanyValues, getMissionVision, getStats } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { StatsBar } from "@/components/sections/StatsBar";
import { OriginStory } from "@/components/sections/OriginStory";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { FamilyPanel } from "@/components/sections/FamilyPanel";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet The Experts — a home services company serving Malé and Hulhumalé, with 40 years of combined experience and 200 completed projects.",
};

export default async function AboutPage() {
  const [stats, values, { mission, vision }] = await Promise.all([
    getStats("about"),
    getCompanyValues(),
    getMissionVision(),
  ]);

  return (
    <>
      <PageHero
        lines={[{ text: "Meet the" }, { text: "Experts", outline: true }]}
        eyebrow="About The Experts"
        media={images.aboutHero}
      />
      <StatsBar stats={stats} />
      <OriginStory mission={mission} vision={vision} />
      <ValuesGrid values={values} />
      <FamilyPanel />
    </>
  );
}

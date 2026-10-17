import type { Metadata } from "next";

import { REGIONS } from "@/features/regions/regions";
import { HowToChooseSection } from "@/features/treks/components/HowToChooseSection";
import { TreksBrowser } from "@/features/treks/components/TreksBrowser";
import { TreksHero } from "@/features/treks/components/TreksHero";
import { TREKS } from "@/features/treks/treks";

// TRD: list-page intros and their SEO are static in code.
export const metadata: Metadata = {
  title: "Nepal treks",
  description:
    "Every trek is private, led by a local guide and planned with you on WhatsApp. Filter by region, length and difficulty, or ask us to suggest one.",
};

const TreksPage = () => (
  <main className="flex-1 bg-page">
    <TreksHero trekCount={TREKS.length} regionCount={REGIONS.length} />
    <TreksBrowser />
    <HowToChooseSection />
  </main>
);

export default TreksPage;

import type { Metadata } from "next";

import { listRegions } from "@/features/regions/services/regionsRepository";
import { HowToChooseSection } from "@/features/treks/components/HowToChooseSection";
import { TreksBrowser } from "@/features/treks/components/TreksBrowser";
import { TreksHero } from "@/features/treks/components/TreksHero";
import { listTreks } from "@/features/treks/services/treksRepository";

// TRD: list-page intros and their SEO are static in code.
export const metadata: Metadata = {
  title: "Nepal treks",
  description:
    "Every trek is private, led by a local guide and planned with you on WhatsApp. Filter by region, length and difficulty, or ask us to suggest one.",
};

/**
 * The Treks page: published treks and the regions come from the database (cached; a save in the admin
 * refreshes them, see lib/cacheTags). When the database can't be read, app/error.tsx shows instead.
 */
const TreksPage = async () => {
  const [treks, regions] = await Promise.all([listTreks(), listRegions()]);

  return (
    <main className="flex-1 bg-page">
      <TreksHero trekCount={treks.length} regionCount={regions.length} />
      <TreksBrowser treks={treks} regions={regions} />
      <HowToChooseSection treks={treks} />
    </main>
  );
};

export default TreksPage;

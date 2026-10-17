import type { Metadata } from "next";

import { HomeHero } from "@/features/home/components/HomeHero";
import { RegionsSection } from "@/features/home/components/RegionsSection";
import { TreksSection } from "@/features/home/components/TreksSection";
import { TrekFinder } from "@/features/home/components/TrekFinder";
import { SiteHeader } from "@/features/site-header/components/SiteHeader";

export const metadata: Metadata = {
  description:
    "Nine trekking regions, guides born in the valleys they lead, and a real person to plan it with you on WhatsApp.",
};

const HomePage = () => (
  <>
    {/* Overlay header, laid over the hero photo; it stays outside <main> so it keeps its banner role. */}
    <div className="absolute inset-x-0 top-0 z-40">
      <SiteHeader variant="overlay" />
    </div>
    <main className="flex-1 bg-surface">
      <HomeHero />
      <TrekFinder />
      <RegionsSection />
      <TreksSection />
    </main>
  </>
);

export default HomePage;

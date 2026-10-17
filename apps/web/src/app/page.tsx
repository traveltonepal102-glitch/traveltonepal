import type { Metadata } from "next";

import { GuidesSection } from "@/features/home/components/GuidesSection";
import { HomeHero } from "@/features/home/components/HomeHero";
import { HowBookingWorksSection } from "@/features/home/components/HowBookingWorksSection";
import { PlanTrekCta } from "@/features/home/components/PlanTrekCta";
import { RegionsSection } from "@/features/home/components/RegionsSection";
import { ReviewsSection } from "@/features/home/components/ReviewsSection";
import { TrekFinder } from "@/features/home/components/TrekFinder";
import { TreksSection } from "@/features/home/components/TreksSection";
import { WhyUsSection } from "@/features/home/components/WhyUsSection";
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
      <WhyUsSection />
      <HowBookingWorksSection />
      <ReviewsSection />
      <GuidesSection />
      <PlanTrekCta />
    </main>
  </>
);

export default HomePage;

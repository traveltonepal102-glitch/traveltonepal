import type { Metadata } from "next";

import { CustomAdventuresSection } from "@/features/adventures/components/CustomAdventuresSection";
import { listGuideCards } from "@/features/guides/services/guidesRepository";
import { GuidesSection } from "@/features/home/components/GuidesSection";
import { HomeHero } from "@/features/home/components/HomeHero";
import { HowBookingWorksSection } from "@/features/home/components/HowBookingWorksSection";
import { PlanTrekCta } from "@/features/home/components/PlanTrekCta";
import { RegionsSection } from "@/features/home/components/RegionsSection";
import { ReviewsSection } from "@/features/home/components/ReviewsSection";
import { TrekFinder } from "@/features/home/components/TrekFinder";
import { TreksSection } from "@/features/home/components/TreksSection";
import { WhyUsSection } from "@/features/home/components/WhyUsSection";
import { homeGuides, homeTreks } from "@/features/home/homeContent";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { SiteHeader } from "@/features/site-header/components/SiteHeader";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { getListPageTop } from "@/features/site-pages/services/sitePagesRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { ROUTES } from "@/lib/routes";

/** The top of the page and its Google result (Pages › List pages › Home), with the current counts. */
const homeTop = async () => {
  const [regions, treks] = await Promise.all([listRegions(), listTreks()]);
  return getListPageTop("home", { regions: regions.length, treks: treks.length });
};

export const generateMetadata = async (): Promise<Metadata> => sitePageMetadata(await homeTop(), ROUTES.home);

/**
 * The home page; regions, popular treks and travel guides come from the database (cached, see lib/cacheTags).
 * When the database can't be read, app/error.tsx shows instead (a failed refresh keeps the last good page).
 */
const HomePage = async () => {
  const [regions, treks, guides, top] = await Promise.all([listRegions(), listTreks(), listGuideCards(), homeTop()]);

  return (
    <>
      {/* Overlay header, laid over the hero photo; it stays outside <main> so it keeps its banner role. */}
      <div className="absolute inset-x-0 top-0 z-40">
        <SiteHeader variant="overlay" />
      </div>
      <main className="flex-1 bg-surface">
        <PageSchemasJsonLd kind="page" slug="home" />
        <HomeHero top={top} />
        <TrekFinder regions={regions} />
        <RegionsSection regions={regions} />
        <TreksSection treks={homeTreks(treks)} />
        <CustomAdventuresSection />
        <WhyUsSection />
        <HowBookingWorksSection />
        <ReviewsSection />
        <GuidesSection guides={homeGuides(guides)} />
        <PlanTrekCta />
      </main>
    </>
  );
};

export default HomePage;

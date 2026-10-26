import type { Metadata } from "next";

import { GuidesPage } from "@/features/guides/components/GuidesPage";
import { listTravelGuides } from "@/features/guides/services/guidesRepository";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { getListPageTop } from "@/features/site-pages/services/sitePagesRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { ROUTES } from "@/lib/routes";

/** The top of the page and its Google result (Pages › List pages › Travel guides), with the current counts. */
const guidesTop = async () => {
  const [regions, treks] = await Promise.all([listRegions(), listTreks()]);
  return getListPageTop("travel-guides", { regions: regions.length, treks: treks.length });
};

export const generateMetadata = async (): Promise<Metadata> => sitePageMetadata(await guidesTop(), ROUTES.guides);

const TravelGuides = async () => {
  const [guides, top] = await Promise.all([listTravelGuides(), guidesTop()]);
  return (
    <main className="flex-1 bg-page">
      <GuidesPage top={top} guides={guides} />
    </main>
  );
};

export default TravelGuides;

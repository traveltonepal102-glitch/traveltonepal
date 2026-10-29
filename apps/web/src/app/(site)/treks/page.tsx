import type { Metadata } from "next";

import { listRegions } from "@/features/regions/services/regionsRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { getListPageTop } from "@/features/site-pages/services/sitePagesRepository";
import { HowToChooseSection } from "@/features/treks/components/HowToChooseSection";
import { TreksBrowser } from "@/features/treks/components/TreksBrowser";
import { TreksHero } from "@/features/treks/components/TreksHero";
import { listTreks } from "@/features/treks/services/treksRepository";
import { ROUTES } from "@/lib/routes";

/** The top of the page and its Google result (Pages › List pages › Treks), with the current counts. */
const treksTop = async () => {
  const [treks, regions] = await Promise.all([listTreks(), listRegions()]);
  return getListPageTop("treks", { regions: regions.length, treks: treks.length });
};

export const generateMetadata = async (): Promise<Metadata> => sitePageMetadata(await treksTop(), ROUTES.treks);

/**
 * The Treks page: published treks and the regions come from the database (cached; a save in the admin
 * refreshes them, see lib/cacheTags). When the database can't be read, app/error.tsx shows instead.
 */
const TreksPage = async () => {
  const [treks, regions, top] = await Promise.all([listTreks(), listRegions(), treksTop()]);

  return (
    <main className="flex-1 bg-page">
      <PageSchemasJsonLd kind="page" slug="treks" />
      <TreksHero top={top} trekCount={treks.length} regionCount={regions.length} />
      <TreksBrowser treks={treks} regions={regions} />
      <HowToChooseSection treks={treks} />
    </main>
  );
};

export default TreksPage;

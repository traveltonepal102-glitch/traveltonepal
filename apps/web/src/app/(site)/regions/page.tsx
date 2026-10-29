import type { Metadata } from "next";

import { RegionsPage } from "@/features/region-list/components/RegionsPage";
import { regionListItems } from "@/features/region-list/regionListItems";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteDefaults } from "@/features/seo/withSiteDefaults";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { getListPageTop } from "@/features/site-pages/services/sitePagesRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { ROUTES } from "@/lib/routes";

/** The top of the page and its Google result (Pages › List pages › Regions), with the current counts. */
const regionsTop = async () => {
  const [regions, treks] = await Promise.all([listRegionCards(), listTreks()]);
  return getListPageTop("regions", { regions: regions.length, treks: treks.length });
};

export const generateMetadata = async (): Promise<Metadata> => withSiteDefaults(sitePageMetadata(await regionsTop(), ROUTES.regions));

/**
 * The Regions page: regions and published treks come from the database (cached; a save in the admin refreshes
 * them, see lib/cacheTags). When the database can't be read, app/error.tsx shows instead.
 */
const Regions = async () => {
  const [regions, treks, top] = await Promise.all([listRegionCards(), listTreks(), regionsTop()]);

  return (
    <main className="flex-1 bg-page">
      <PageSchemasJsonLd kind="page" slug="regions" />
      <RegionsPage top={top} regions={regionListItems(regions, treks)} trekCount={treks.length} />
    </main>
  );
};

export default Regions;

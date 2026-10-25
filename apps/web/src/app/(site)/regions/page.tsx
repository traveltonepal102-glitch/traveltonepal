import type { Metadata } from "next";

import { RegionsPage } from "@/features/region-list/components/RegionsPage";
import { regionListItems } from "@/features/region-list/regionListItems";
import { regionsMetadata } from "@/features/region-list/seo";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";

// TRD: list-page intros and their SEO are static in code; the region count in them follows the data.
export const generateMetadata = async (): Promise<Metadata> => regionsMetadata((await listRegionCards()).length);

/**
 * The Regions page: regions and published treks come from the database (cached; a save in the admin refreshes
 * them, see lib/cacheTags). When the database can't be read, app/error.tsx shows instead.
 */
const Regions = async () => {
  const [regions, treks] = await Promise.all([listRegionCards(), listTreks()]);

  return (
    <main className="flex-1 bg-page">
      <RegionsPage regions={regionListItems(regions, treks)} trekCount={treks.length} />
    </main>
  );
};

export default Regions;

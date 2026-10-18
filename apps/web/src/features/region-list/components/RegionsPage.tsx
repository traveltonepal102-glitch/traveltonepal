import { JsonLd } from "@/components/shared/JsonLd";
import { TREKS } from "@/features/treks/treks";
import { GOOGLE_MAPS_CONFIG } from "@/lib/googleMaps/config";

import { regionListItems } from "../regionListItems";
import { regionsJsonLd } from "../seo";
import { RegionCardGrid } from "./RegionCardGrid";
import { RegionCompareTable } from "./RegionCompareTable";
import { RegionListHeading } from "./RegionListHeading";
import { RegionMapExplorer } from "./RegionMapExplorer";
import { RegionPicks } from "./RegionPicks";
import { RegionSeasonsTable } from "./RegionSeasonsTable";
import { RegionsCta } from "./RegionsCta";
import { RegionsHero } from "./RegionsHero";
import { WRAP } from "./styles";

/** The region selected on the map when the page opens (the one with a full page so far). */
const INITIAL_REGION = "langtang";

/** Regions page (design: Regions.dc.html). */
export const RegionsPage = () => {
  const regions = regionListItems();
  const altitudes = regions.map((region) => region.maxAltitudeM);

  return (
    <>
      <JsonLd data={regionsJsonLd(regions)} />
      <RegionsHero
        regionCount={regions.length}
        trekCount={TREKS.length}
        altitudeRange={{ min: Math.min(...altitudes), max: Math.max(...altitudes) }}
      />

      <section aria-labelledby="regions-map-title" className="pt-10 pb-4">
        <div className={`${WRAP} flex flex-col gap-4.5`}>
          <RegionListHeading
            id="regions-map-title"
            kicker="Where they are"
            title="Nepal's trekking regions on the map"
            description="Click a region on the map or in the list to see what it is like."
          />
          <RegionMapExplorer regions={regions} initialSlug={INITIAL_REGION} googleMaps={GOOGLE_MAPS_CONFIG} />
        </div>
      </section>

      <RegionCardGrid regions={regions} />
      <RegionPicks regions={regions} />
      <RegionCompareTable regions={regions} />
      <RegionSeasonsTable regions={regions} />
      <RegionsCta />
    </>
  );
};

import { JsonLd } from "@/components/shared/JsonLd";
import { GOOGLE_MAPS_CONFIG } from "@/lib/googleMaps/config";

import type { RegionListItem } from "../regionListItems";
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

type RegionsPageProps = {
  /** The regions, west to east (regionListItems). */
  regions: readonly RegionListItem[];
  /** How many treks are published, in every region. */
  trekCount: number;
};

/** Regions page (design: Regions.dc.html). Without a region to show: the hero and the way to ask us. */
export const RegionsPage = ({ regions, trekCount }: RegionsPageProps) => {
  const altitudes = regions.map((region) => region.maxAltitudeM);
  const hero = (
    <RegionsHero
      regionCount={regions.length}
      trekCount={trekCount}
      altitudeRange={regions.length > 0 ? { min: Math.min(...altitudes), max: Math.max(...altitudes) } : undefined}
    />
  );
  if (regions.length === 0) {
    return (
      <>
        {hero}
        <RegionsCta />
      </>
    );
  }

  return (
    <>
      <JsonLd data={regionsJsonLd(regions)} />
      {hero}

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

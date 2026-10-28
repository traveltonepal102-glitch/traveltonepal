import { Icon } from "@ttn/ui/icon";

import { RegionTile } from "@/features/regions/components/RegionTile";
import type { RegionSummary } from "@/features/regions/regions";
import { ROUTES } from "@/lib/routes";

import { homeRegions, regionsHeading } from "../homeContent";
import { SeeMoreRegionsCard } from "./SeeMoreRegionsCard";
import { SwipeHint } from "./SwipeHint";
import { SWIPE_ITEM, SWIPE_ROW, SWIPE_ROW_RESET } from "./swipeRow";

/**
 * "Nine regions" (design: Main.dc.html); the count follows the regions in the database.
 * - Phones: a swipe row; each tile is 84% wide so the next one peeks in, and snaps to the left edge.
 * - md and up: a grid of tiles at least 230px wide; the first region is the big 2×2 tile.
 * Up to eight regions show; "See more regions" (design: Main.dc.html) always takes the next place, naming the
 * regions left out (if any), so the grid comes out even at 4 columns.
 */
export const RegionsSection = ({ regions }: { regions: RegionSummary[] }) => {
  // No regions to show: no section, rather than an empty one.
  if (regions.length === 0) return null;
  const { shown, more } = homeRegions(regions);

  return (
    <section id="regions" aria-labelledby="regions-title" className="py-16 md:py-24">
      <div className="mx-auto flex max-w-content flex-col gap-9 px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4.5">
          <div className="flex max-w-155 flex-col gap-2.5">
            <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
              <Icon name="landscape" size={18} />
              Choose your mountains
            </p>
            <h2 id="regions-title" className="text-h2 tracking-tight md:text-h1">
              {regionsHeading(regions.length)}
            </h2>
          </div>
          <p className="max-w-95 text-body-lg">
            From the classic trail to Everest to quiet Tamang villages a day from Kathmandu.
          </p>
        </div>

        <ul
          aria-label="Trekking regions"
          className={`gap-3 pb-1 md:grid md:auto-rows-52.5 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-3.5 md:pb-0 ${SWIPE_ROW} ${SWIPE_ROW_RESET}`}
        >
          {shown.map((region, index) => {
            const isFeatured = index === 0;
            return (
              <li
                key={region.slug}
                className={`h-85 md:h-auto ${SWIPE_ITEM} ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <RegionTile region={region} index={index} isFeatured={isFeatured} />
              </li>
            );
          })}
          <li className={`h-85 md:h-auto ${SWIPE_ITEM}`}>
            <SeeMoreRegionsCard names={more.map((region) => region.name)} />
          </li>
        </ul>

        <SwipeHint text={regions.length > 1 ? `Swipe to see all ${regions.length} regions` : "Swipe to see more"} linkLabel="All regions" href={ROUTES.regions} />
      </div>
    </section>
  );
};

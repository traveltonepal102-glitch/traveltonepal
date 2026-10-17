import { Icon } from "@ttn/ui/icon";

import { RegionTile } from "@/features/regions/components/RegionTile";
import { REGIONS } from "@/features/regions/regions";
import { ROUTES } from "@/lib/routes";

import { SwipeHint } from "./SwipeHint";
import { SWIPE_ITEM, SWIPE_ROW, SWIPE_ROW_RESET } from "./swipeRow";

/**
 * "Nine regions" (design: Main.dc.html).
 * - Phones: a swipe row; each tile is 84% wide so the next one peeks in, and snaps to the left edge.
 * - md and up: a grid of tiles at least 230px wide; the first region is the big 2×2 tile.
 *   With 9 regions the grid comes out even at 3 and 4 columns.
 */
export const RegionsSection = () => (
  <section id="regions" aria-labelledby="regions-title" className="py-16 md:py-24">
    <div className="mx-auto flex max-w-content flex-col gap-9 px-4 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4.5">
        <div className="flex max-w-155 flex-col gap-2.5">
          <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
            <Icon name="landscape" size={18} />
            Choose your mountains
          </p>
          <h2 id="regions-title" className="text-h2 tracking-tight md:text-h1">
            Nine regions. Each one a different Nepal.
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
        {REGIONS.map((region, index) => {
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
      </ul>

      <SwipeHint text={`Swipe to see all ${REGIONS.length} regions`} linkLabel="All regions" href={ROUTES.regions} />
    </div>
  </section>
);

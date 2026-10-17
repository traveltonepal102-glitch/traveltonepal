import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { RegionTile } from "@/features/regions/components/RegionTile";
import { REGIONS } from "@/features/regions/regions";
import { ROUTES } from "@/lib/routes";

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
        className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:grid md:auto-rows-52.5 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-3.5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {REGIONS.map((region, index) => {
          const isFeatured = index === 0;
          return (
            <li
              key={region.slug}
              className={`h-85 flex-[0_0_84%] snap-start md:h-auto ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <RegionTile region={region} index={index} isFeatured={isFeatured} />
            </li>
          );
        })}
      </ul>

      {/* Phones only: tells people the row scrolls sideways, and links to every region. */}
      <div className="-mt-4.5 flex items-center justify-between gap-3 text-body-sm text-muted-foreground md:hidden">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="swipe" />
          Swipe to see all {REGIONS.length} regions
        </span>
        <Link
          href={ROUTES.regions}
          className="inline-flex min-h-11 items-center gap-1 rounded-sm font-extrabold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          All regions
          <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
    </div>
  </section>
);

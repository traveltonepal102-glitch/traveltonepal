import { Icon } from "@ttn/ui/icon";

import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail, TrekRouteStop } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { RouteMonthsTable } from "./RouteMonthsTable";
import { RouteRegionCard } from "./RouteRegionCard";

/** "Starts in Langtang, passes through Ganesh Himal and ends in Manaslu." */
const routeSentence = (stops: readonly TrekRouteStop[]) => {
  const [first, ...rest] = stops;
  const last = rest.at(-1);
  const middle = rest.slice(0, -1).map((stop) => stop.name);
  const through = middle.length ? `, passes through ${middle.join(", ")}` : "";
  return `This trek starts in ${first.name}${through} and ends in ${last?.name}. Each region has its own landscape, permits and best season.`;
};

type TrekRouteRegionsProps = Pick<TrekDetail, "routeStops" | "monthRatings"> & { heading: string };

/**
 * "Regions on this route" (a trek across several regions only): the regions in route order with their days, each
 * region's details from its own page, and the best months of each region and of the whole route.
 */
export const TrekRouteRegions = ({ heading, routeStops, monthRatings }: TrekRouteRegionsProps) => {
  if (routeStops.length < 2) return null;

  return (
    <section id={TREK_SECTION_IDS.regions} aria-labelledby="trek-regions-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
      <SectionHeading
        id="trek-regions-title"
        eyebrow={`Route through ${routeStops.length} regions`}
        title={heading}
        description={routeSentence(routeStops)}
      />
      <ol aria-label="Route" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {routeStops.map((stop, index) => (
          <li key={stop.slug} className="inline-flex items-center gap-1.5">
            {index > 0 && <Icon name="arrow_forward" size={16} className="text-muted-foreground" />}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-caption font-bold text-ink">
              <span aria-hidden="true" className="inline-flex size-5.5 items-center justify-center rounded-full bg-brand text-[11px] text-on-brand">
                {index + 1}
              </span>
              {stop.name}
            </span>
          </li>
        ))}
      </ol>
      <ol className={`grid gap-3 sm:grid-cols-2 ${routeStops.length >= 3 ? "xl:grid-cols-3" : ""}`}>
        {routeStops.map((stop, index) => (
          <li key={stop.slug}>
            <RouteRegionCard stop={stop} number={index + 1} />
          </li>
        ))}
      </ol>
      <RouteMonthsTable stops={routeStops} routeMonths={monthRatings} />
    </section>
  );
};

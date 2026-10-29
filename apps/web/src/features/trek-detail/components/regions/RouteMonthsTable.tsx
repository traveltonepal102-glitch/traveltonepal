import { MONTH_NAMES, RATING_LOOK, RATINGS } from "@/features/guide-article/components/body/monthRatings";
import type { MonthRating } from "@/features/regions/overviews";

import type { TrekRouteStop } from "../../types";
import { PANEL } from "../styles";

type RouteMonthsTableProps = {
  stops: readonly TrekRouteStop[];
  /** The whole route's months (each the worst of its regions), as the start-date picker colours them. */
  routeMonths: readonly MonthRating[] | null;
};

type Row = { name: string; months: readonly MonthRating[]; isRoute?: boolean };

/**
 * "Best months along the route": a month row per region and, last, the whole route, so trekkers see why a month
 * is marked as it is (the route is only as good as its worst region that month).
 */
export const RouteMonthsTable = ({ stops, routeMonths }: RouteMonthsTableProps) => {
  const rows: Row[] = [
    ...stops.flatMap((stop): Row[] => (stop.months?.length === 12 ? [{ name: stop.name, months: stop.months }] : [])),
    ...(routeMonths ? [{ name: "Whole route", months: routeMonths, isRoute: true }] : []),
  ];
  if (rows.length < 2) return null;

  return (
    <div className={`${PANEL} flex flex-col gap-3 p-4 md:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="trek-route-months-title" className="text-base font-extrabold text-ink">
          Best months along the route
        </h3>
        <ul aria-label="Legend" className="flex flex-wrap gap-3 text-xs font-semibold text-text">
          {RATINGS.map((rating) => (
            <li key={rating} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={`size-3 rounded-sm ${RATING_LOOK[rating].bar}`} />
              {RATING_LOOK[rating].label}
            </li>
          ))}
        </ul>
      </div>
      <div role="region" aria-labelledby="trek-route-months-title" tabIndex={0} className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <table className="w-full min-w-140 border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th scope="col" className="w-30">
                <span className="sr-only">Region</span>
              </th>
              {MONTH_NAMES.map((month) => (
                <th key={month} scope="col" className="text-center font-bold text-muted-foreground">
                  <abbr title={month} className="no-underline">
                    {month.slice(0, 3)}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className={`pr-2 text-left ${row.isRoute ? "font-extrabold text-brand" : "font-bold text-ink"}`}>
                  {row.name}
                </th>
                {row.months.map((rating, month) => (
                  <td key={MONTH_NAMES[month]} title={`${row.name}, ${MONTH_NAMES[month]}: ${RATING_LOOK[rating].label.toLowerCase()}`} className="p-0">
                    <span className={`block rounded-sm ${row.isRoute ? "h-6.5 ring-2 ring-brand/30" : "h-5"} ${RATING_LOOK[rating].bar}`}>
                      <span className="sr-only">{RATING_LOOK[rating].label}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Each month on the route is only as good as its worst region. The start-date picker uses the whole route&apos;s months.
      </p>
    </div>
  );
};

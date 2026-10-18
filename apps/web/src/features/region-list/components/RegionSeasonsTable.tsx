import type { MonthRating } from "@/features/regions/overviews";

import type { RegionListItem } from "../regionListItems";
import { RegionListHeading } from "./RegionListHeading";
import { CARD, WRAP } from "./styles";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

const RATINGS: Record<MonthRating, { label: string; swatch: string }> = {
  best: { label: "Best", swatch: "bg-month-best" },
  possible: { label: "Possible", swatch: "bg-month-possible" },
  avoid: { label: "Not ideal", swatch: "bg-month-avoid" },
};

const Legend = () => (
  <ul aria-label="Legend" className="flex flex-wrap gap-3.5 text-xs font-semibold text-text">
    {(Object.keys(RATINGS) as MonthRating[]).map((rating) => (
      <li key={rating} className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`size-3.5 rounded-sm ${RATINGS[rating].swatch}`} />
        {RATINGS[rating].label}
      </li>
    ))}
  </ul>
);

/** "Best months for each region": a region × month table of colored cells, with a word for screen readers. */
export const RegionSeasonsTable = ({ regions }: { regions: readonly RegionListItem[] }) => (
  <section aria-labelledby="regions-seasons-title" className="pt-8 pb-10">
    <div className={`${WRAP} flex flex-col gap-4`}>
      <RegionListHeading id="regions-seasons-title" kicker="Seasons" title="Best months for each region" aside={<Legend />} />
      <div
        role="region"
        aria-labelledby="regions-seasons-title"
        tabIndex={0}
        className={`${CARD} overflow-x-auto p-4.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
      >
        <table className="w-full min-w-190 border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th scope="col" className="w-47.5">
                <span className="sr-only">Region</span>
              </th>
              {MONTHS.map((month, index) => (
                <th key={month} scope="col" className="text-center font-bold text-muted-foreground">
                  <abbr title={MONTH_NAMES[index]} className="no-underline">
                    {month}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.slug}>
                <th scope="row" className="pr-2 text-left font-bold text-ink">
                  {region.name}
                </th>
                {region.months.map((rating, index) => (
                  <td key={MONTHS[index]} title={`${region.name}, ${MONTH_NAMES[index]}: ${RATINGS[rating].label.toLowerCase()}`} className="p-0">
                    <span className={`block h-6.5 rounded-sm ${RATINGS[rating].swatch}`}>
                      <span className="sr-only">{RATINGS[rating].label}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Rain-shadow areas such as Nar Phu stay drier in the monsoon. Winter is clear but cold above 4,000 m.
      </p>
    </div>
  </section>
);

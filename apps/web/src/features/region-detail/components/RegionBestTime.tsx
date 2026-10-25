import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { MONTH_NAMES } from "@ttn/ui/lib/bestMonths";

import type { MonthRating, RegionDetail } from "../types";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { CARD, WRAP } from "./styles";

const RATINGS: Record<MonthRating, { label: string; cell: string; swatch: string; season: string; icon: IconName }> = {
  best: { label: "Best", cell: "bg-month-best text-white", swatch: "bg-month-best", season: "border-t-whatsapp text-whatsapp", icon: "wb_sunny" },
  possible: {
    label: "Possible",
    cell: "bg-month-possible text-[#5a3300]",
    swatch: "bg-month-possible",
    season: "border-t-saffron-deep text-saffron-ink",
    icon: "wb_twilight",
  },
  avoid: {
    label: "Not ideal",
    cell: "bg-month-avoid text-muted-foreground",
    swatch: "bg-month-avoid",
    season: "border-t-muted-foreground text-muted-foreground",
    icon: "water_drop",
  },
};

/** "Best time to go": a month-by-month strip and one card per season. */
export const RegionBestTime = ({ region }: { region: RegionDetail }) => (
  <section id="best-time" aria-labelledby="region-best-time-title" className={`${WRAP} flex scroll-mt-14 flex-col gap-5.5 py-14`}>
    <RegionSectionHeading id="region-best-time-title" kicker="Best time to go" title={`When to trek ${region.name}`} />

    <div className={`${CARD} flex flex-col gap-3 p-4.5 md:p-5.5`}>
      <ol className="grid grid-cols-6 gap-1.5 lg:grid-cols-12">
        {region.months.map((rating, index) => (
          <li key={MONTH_NAMES[index]} className={`flex flex-col gap-0.5 rounded-md py-3.5 text-center ${RATINGS[rating].cell}`}>
            <span className="text-[15px] font-extrabold">{MONTH_NAMES[index]}</span>
            <span className="text-[11px] font-semibold">{RATINGS[rating].label}</span>
          </li>
        ))}
      </ol>
      <ul aria-label="Legend" className="flex flex-wrap gap-4 text-caption font-normal text-muted-foreground">
        {(Object.keys(RATINGS) as MonthRating[]).map((rating) => (
          <li key={rating} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={`size-3 rounded-[3px] ${RATINGS[rating].swatch}`} />
            {RATINGS[rating].label}
          </li>
        ))}
      </ul>
    </div>

    {region.seasons.length > 0 && (
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {region.seasons.map((season) => {
          const look = RATINGS[season.rating];
          return (
            <li key={season.name} className={`${CARD} flex flex-col gap-2 border-t-4 p-4.5 ${look.season}`}>
              <p className="inline-flex items-center gap-2 font-extrabold">
                <Icon name={look.icon} />
                {look.label}
              </p>
              <h3 className="text-[17px] font-bold">{season.name}</h3>
              <p className="text-body-sm text-text">{season.text}</p>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);

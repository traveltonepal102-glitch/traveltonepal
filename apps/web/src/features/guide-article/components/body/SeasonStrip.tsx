import type { MonthRating } from "@/features/regions/overviews";

import { MONTH_NAMES, RATINGS, RATING_LOOK } from "./monthRatings";

/** Twelve colored bars (Jan–Dec) with a legend. Each bar's rating is also in its label for screen readers. */
export const SeasonStrip = ({ months }: { months: readonly MonthRating[] }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4.5">
    <ol className="grid grid-cols-6 gap-x-1 gap-y-3 sm:grid-cols-12">
      {months.map((rating, index) => {
        const name = MONTH_NAMES[index] ?? "";
        const look = RATING_LOOK[rating];
        return (
          <li key={name} className="flex flex-col items-center gap-1">
            <span aria-hidden="true" title={`${name}: ${look.label.toLowerCase()}`} className={`block h-7.5 w-full rounded-md ${look.bar}`} />
            <span className="text-[11px] font-bold text-muted-foreground">
              <span aria-hidden="true">{name.slice(0, 3)}</span>
              <span className="sr-only">
                {name}: {look.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
    <ul aria-label="Legend" className="flex flex-wrap gap-3.5 text-xs font-semibold text-text">
      {RATINGS.map((rating) => (
        <li key={rating} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-3.5 rounded-sm ${RATING_LOOK[rating].bar}`} />
          {RATING_LOOK[rating].label}
        </li>
      ))}
    </ul>
  </div>
);

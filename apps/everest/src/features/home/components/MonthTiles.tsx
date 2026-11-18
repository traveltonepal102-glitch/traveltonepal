import { MONTH_NAMES, monthNames } from "@ttn/ui/lib/bestMonths";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";

import { SITE_LANGUAGE } from "@/lib/site";

const RATING: Record<MonthRating, { bar: string; key: string; words: string }> = {
  best: { bar: "h-full bg-ocean", key: "bg-ocean", words: "Ideal" },
  possible: { bar: "h-[55%] bg-glacier", key: "bg-glacier", words: "Möglich" },
  avoid: { bar: "h-[18%] border-[1.5px] border-dashed border-field bg-transparent", key: "border-[1.5px] border-dashed border-field", words: "Meiden" },
};

const LEGEND: readonly MonthRating[] = ["best", "possible", "avoid"];

const MONTHS = monthNames(SITE_LANGUAGE);

/** The twelve months as bars (design: Best months), as tall as they are good; colour always comes with the words for screen readers. */
export const MonthTiles = ({ ratings }: { ratings: readonly MonthRating[] }) => (
  <div className="flex flex-col gap-4 rounded-[20px] border border-solid border-line bg-snow p-7 max-sm:p-4">
    <ul className="m-0 grid h-47.5 list-none grid-cols-12 items-end gap-2 p-0 max-sm:gap-1">
      {ratings.map((rating, month) => (
        <li key={MONTH_NAMES[month]} className="flex h-full flex-col justify-end gap-2 text-center">
          <span aria-hidden="true" className="text-xs leading-none text-muted max-sm:hidden">
            {RATING[rating].words}
          </span>
          <span aria-hidden="true" className={`rounded-t-[10px] rounded-b-sm ${RATING[rating].bar}`} />
          <strong className="text-sm leading-none font-semibold text-ink max-sm:text-xs">
            {MONTHS[month]}
            <span className="sr-only">: {RATING[rating].words}</span>
          </strong>
        </li>
      ))}
    </ul>
    <p className="m-0 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-5 text-muted">
      {LEGEND.filter((rating) => ratings.includes(rating)).map((rating) => (
        <span key={rating} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-3 rounded-[3px] ${RATING[rating].key}`} />
          {RATING[rating].words}
        </span>
      ))}
    </p>
  </div>
);

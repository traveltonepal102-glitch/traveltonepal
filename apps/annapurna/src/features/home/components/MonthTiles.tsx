import { MONTH_NAMES, monthNames } from "@ttn/ui/lib/bestMonths";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import { SITE_LANGUAGE } from "@/lib/site";

const RATING: Record<MonthRating, { tile: string; words: string }> = {
  best: { tile: "bg-navy text-snow", words: "Beste Zeit" },
  possible: { tile: "bg-sun text-ink", words: "Möglich" },
  avoid: { tile: "border border-solid border-line bg-cloud text-muted", words: "Nicht empfohlen" },
};

const LEGEND: readonly MonthRating[] = ["best", "possible", "avoid"];

/** The twelve months as coloured tiles with a legend; colour always comes with the words for screen readers. */
export const MonthTiles = ({ ratings }: { ratings: readonly MonthRating[] }) => (
  <>
    <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-12">
      {ratings.map((rating, month) => (
        <li key={MONTH_NAMES[month]} className={`rounded-lg py-3 text-center text-sm leading-4.5 font-semibold ${RATING[rating].tile}`}>
          {monthNames(SITE_LANGUAGE)[month]}
          <span className="sr-only">: {RATING[rating].words}</span>
        </li>
      ))}
    </ul>
    <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm leading-5 text-muted">
      {LEGEND.map((rating) => (
        <span key={rating} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-3 rounded-[3px] ${RATING[rating].tile}`} />
          {RATING[rating].words}
        </span>
      ))}
    </p>
  </>
);

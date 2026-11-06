import { SectionHeading } from "@/components/shared/SectionHeading";
import { MONTH_NAMES } from "@ttn/ui/lib/bestMonths";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";

const RATING: Record<MonthRating, { tile: string; words: string }> = {
  best: { tile: "bg-forest text-snow", words: "Best" },
  possible: { tile: "bg-saffron text-ink", words: "Possible" },
  avoid: { tile: "border border-solid border-line bg-stone text-muted", words: "Avoid" },
};

const LEGEND: readonly MonthRating[] = ["best", "possible", "avoid"];

/** The twelve months, rated from the regions on the route; colour always comes with the words for screen readers. */
export const BestMonths = ({ heading, ratings }: { heading: string; ratings: readonly MonthRating[] }) => (
  <section aria-labelledby="months-h" id="months" className="flex flex-col gap-5">
    <SectionHeading id="months-h" eyebrow="When to go" title={heading} />
    <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-12">
      {ratings.map((rating, month) => (
        <li key={MONTH_NAMES[month]} className={`rounded-lg py-3 text-center text-sm leading-4.5 font-semibold ${RATING[rating].tile}`}>
          {MONTH_NAMES[month]}
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
  </section>
);

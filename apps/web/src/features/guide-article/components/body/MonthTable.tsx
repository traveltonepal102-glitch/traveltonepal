import type { MonthRating } from "@/features/regions/overviews";

import type { MonthNote } from "../../types";
import { MONTH_NAMES, RATING_LOOK } from "./monthRatings";

type MonthTableProps = {
  notes: readonly MonthNote[];
  /** The region's rating per month: the "Our verdict" column. */
  ratings: readonly MonthRating[];
};

const CELL = "px-3.5 py-2.75";

/** Month / On the trail / Crowds / Our verdict. Scrolls sideways inside its box on phones. */
export const MonthTable = ({ notes, ratings }: MonthTableProps) => (
  <div className="relative overflow-x-auto rounded-xl border border-line">
    <table className="w-full min-w-140 border-collapse text-left text-body-sm">
      <thead>
        <tr className="bg-page text-[11px] font-bold tracking-[0.06em] text-text uppercase">
          <th scope="col" className={CELL}>Month</th>
          <th scope="col" className={CELL}>On the trail</th>
          <th scope="col" className={CELL}>Crowds</th>
          <th scope="col" className={CELL}>Our verdict</th>
        </tr>
      </thead>
      <tbody>
        {notes.map((note, index) => {
          const rating = ratings[index];
          return (
            <tr key={MONTH_NAMES[index]} className="border-t border-muted">
              <th scope="row" className={`${CELL} font-bold text-ink`}>{MONTH_NAMES[index]}</th>
              <td className={`${CELL} text-text`}>{note.onTheTrail}</td>
              <td className={`${CELL} text-muted-foreground`}>{note.crowds}</td>
              <td className={CELL}>
                {rating && (
                  <span className={`inline-flex rounded-full px-2.5 py-0.75 text-xs font-bold whitespace-nowrap ${RATING_LOOK[rating].chip}`}>
                    {RATING_LOOK[rating].label}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

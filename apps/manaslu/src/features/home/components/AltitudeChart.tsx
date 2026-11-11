import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

/** The shortest bar, in % of the highest, so a low day still shows one. */
const MIN_BAR = 4;

/** Day, place, bar, altitude: the same columns on every row, narrower on a phone. */
const ROW = "grid grid-cols-[1.5rem_7rem_minmax(0,1fr)_3.75rem] items-center gap-x-2.5 sm:grid-cols-[2rem_12rem_minmax(0,1fr)_4.5rem] sm:gap-x-4";

/**
 * A row per day: where it tops out, a bar for its altitude and the altitude in full; the highest day in saffron.
 * Lying down, so long names and full numbers fit on a phone. Each row reads as one sentence to screen readers.
 */
export const AltitudeChart = ({ days }: { days: readonly HomeDay[] }) => {
  if (days.length < 2) return null;
  const top = Math.max(...days.map((day) => day.altitudeM));
  const highest = days.find((day) => day.altitudeM === top) ?? days[0];

  return (
    <figure className="flex flex-col gap-3 rounded-[14px] border border-solid border-line px-4 pt-5 pb-4 sm:px-5">
      <figcaption className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm leading-5 text-muted">
        <span className="font-semibold text-ink">Altitude by day</span>
        <span>
          Highest: {formatAltitude(top)}, {highest.topPlace} (day {highest.number})
        </span>
      </figcaption>
      <div aria-hidden="true" className={`${ROW} border-b border-solid border-line pb-1.5 text-xs leading-4 font-semibold tracking-wide text-muted uppercase`}>
        <span>Day</span>
        <span>Place</span>
        <span />
        <span className="text-right">Altitude</span>
      </div>
      <ol className="flex flex-col gap-1">
        {days.map((day) => {
          const isTop = day.altitudeM === top;
          return (
            <li key={day.number} className={`${ROW} min-h-7 text-sm leading-4.5 ${isTop ? "font-semibold text-ink" : "text-text"}`}>
              <span className="font-semibold text-muted tabular-nums">
                <span className="sr-only">Day </span>
                {day.number}
                <span className="sr-only">:</span>
              </span>
              <span className="break-words">{day.topPlace}</span>
              <span aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-forest-tint">
                <span className={`block h-full rounded-full ${isTop ? "bg-saffron" : "bg-forest"}`} style={{ width: `${Math.max(MIN_BAR, Math.round((day.altitudeM / top) * 100))}%` }} />
              </span>
              <span className="text-right whitespace-nowrap tabular-nums">
                <span className="sr-only">, </span>
                {formatAltitude(day.altitudeM)}
                {isTop && <span className="sr-only">, the highest point</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
};

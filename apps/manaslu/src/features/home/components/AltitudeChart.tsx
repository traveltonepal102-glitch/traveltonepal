import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

const MIN_BAR = 12;

/** One bar per day, the highest point in saffron. Screen readers get the same in one sentence. */
export const AltitudeChart = ({ days }: { days: readonly HomeDay[] }) => {
  if (days.length < 2) return null;
  const top = Math.max(...days.map((day) => day.altitudeM));
  const highest = days.find((day) => day.altitudeM === top) ?? days[0];
  const summary = `Altitude by day: highest ${formatAltitude(top)} on day ${highest.number}, finishing at ${formatAltitude(days[days.length - 1].altitudeM)}.`;

  return (
    <figure className="flex flex-col gap-3 rounded-[14px] border border-solid border-line px-5 pt-5 pb-3.5">
      <figcaption className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm leading-5 text-muted">
        <span className="font-semibold text-ink">Altitude by day</span>
        <span>
          Highest: {formatAltitude(top)} (day {highest.number})
        </span>
      </figcaption>
      {/* Focusable so keyboard users can scroll it sideways on a phone. */}
      <div role="region" aria-label="Altitude chart" tabIndex={0} className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div role="img" aria-label={summary} className="flex h-37.5 items-end gap-1.5">
            {days.map((day) => (
              <div key={day.number} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] leading-3.5 whitespace-nowrap text-muted">{(day.altitudeM / 1000).toFixed(1)}k</span>
                <span
                  className={`w-full max-w-10 rounded-t-md rounded-b-xs ${day.altitudeM === top ? "bg-saffron" : "bg-forest"}`}
                  style={{ height: `${Math.max(MIN_BAR, Math.round((day.altitudeM / top) * 80))}%` }}
                />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="flex gap-1.5 border-t border-solid border-line pt-1.5">
            {days.map((day) => (
              <span key={day.number} className="min-w-0 flex-1 text-center text-xs leading-4 font-semibold text-muted">
                {day.number}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
};

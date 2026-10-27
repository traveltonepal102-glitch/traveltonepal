import { cn } from "@ttn/ui/lib/utils";
import type { CSSProperties } from "react";

import { buildAltitudeProfile } from "../../../lib/altitudeProfile";
import type { AltitudePoint } from "../../../lib/altitudeProfile";
import type { DayAltitude } from "../../../lib/elevationSummary";

type AltitudeChartProps = {
  /** One per day, in order (a day without an altitude yet has no point). */
  days: DayAltitude[];
  /** Opens the day (by its index) to change its altitude. */
  onSelectDay: (index: number) => void;
};

const metres = (value: number) => `${value.toLocaleString("en")} m`;

const at = (point: Pick<AltitudePoint, "x" | "y">): CSSProperties => ({ left: `${point.x}%`, top: `${point.y}%` });

/**
 * The altitude profile drawn from the days, as on the trek page; updates while the days are edited. Only the line
 * is drawn (stretched to the box); labels and points are laid out by the page, so they keep their size at any width
 * and the top label is never cut off. Each point opens its day.
 */
export const AltitudeChart = ({ days, onSelectDay }: AltitudeChartProps) => {
  const profile = buildAltitudeProfile(days.map((day) => day.altitudeM));
  if (!profile) {
    return (
      <p className="m-0 rounded-md border border-dashed border-line-strong bg-page px-4 py-6 text-center text-caption text-muted-foreground">
        The chart appears once two days have an altitude.
      </p>
    );
  }

  const { peak } = profile;
  // Every other "Day n" label when they would crowd: on phones past 8 days, everywhere past 16.
  const isSkipped = (index: number) => index % 2 === 1 && index !== days.length - 1;
  const dayLabelClass = (index: number) => isSkipped(index) && (days.length > 16 ? "hidden" : days.length > 8 && "max-tablet:hidden");

  return (
    <div className="relative h-64 pt-10 pr-7 pb-8 pl-16 max-tablet:h-56 max-tablet:pl-14">
      <div role="group" aria-label={`Altitude profile, highest point ${metres(peak.altitudeM)} on day ${peak.day}`} className="relative h-full">
        {profile.gridLines.map((line) => (
          <div key={line.altitudeM} style={{ top: `${line.y}%` }} className="absolute inset-x-0 border-t border-dashed border-border">
            <span className="absolute right-full mr-2.5 -translate-y-1/2 text-[11px] whitespace-nowrap text-muted-foreground">{metres(line.altitudeM)}</span>
          </div>
        ))}

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          <path d={profile.areaPath} className="fill-brand/10" />
          <path d={profile.linePath} className="fill-none stroke-brand" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        <span style={at(peak)} className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full bg-saffron-tint px-2 py-0.5 text-xs font-bold whitespace-nowrap text-saffron-ink">
          {metres(peak.altitudeM)}
        </span>

        {profile.points.map((point) => {
          const { place } = days[point.day - 1];
          const isPeak = point === peak;
          return (
            <button
              key={point.day}
              type="button"
              style={at(point)}
              onClick={() => onSelectDay(point.day - 1)}
              aria-label={`Day ${point.day}${place ? `, ${place}` : ""}: ${metres(point.altitudeM)}. Change it in Day-by-day itinerary.`}
              className="group absolute z-10 m-0 flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className={cn("block rounded-full border-2 border-solid border-surface shadow-card transition-transform group-hover:scale-125", isPeak ? "size-4 bg-saffron" : "size-3 bg-brand")} />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden -translate-x-1/2 rounded-md bg-navy px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white group-hover:block group-focus-visible:block">
                Day {point.day}
                {place && ` · ${place}`} · {metres(point.altitudeM)} · click to change
              </span>
            </button>
          );
        })}

        {profile.dayXs.map((x, index) => (
          <span
            key={index}
            style={{ left: `${x}%` }}
            className={cn("absolute top-full mt-2.5 -translate-x-1/2 text-[11px] whitespace-nowrap text-muted-foreground", dayLabelClass(index))}
          >
            Day {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

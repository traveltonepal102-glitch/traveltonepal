import { formatAltitude, formatAltitudeWithFeet } from "@/features/treks/format";

import { buildElevationProfile } from "../../elevation";
import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { PANEL } from "../styles";
import { ElevationChart } from "./ElevationChart";

type TrekElevationProps = Pick<TrekDetail, "itinerary" | "trailhead">;

/** "Acclimatization map": the altitude of every itinerary day, the peak and the highest night. */
export const TrekElevation = ({ itinerary, trailhead }: TrekElevationProps) => {
  const profile = buildElevationProfile(itinerary.days);
  if (!profile) return null;

  const { peak, highestNight } = profile;
  const sleepNote =
    highestNight.altitudeM < peak.altitudeM
      ? `You sleep no higher than ${formatAltitude(highestNight.altitudeM)} and only day hike to the high point.`
      : `Your highest night is at ${formatAltitude(highestNight.altitudeM)}, at ${highestNight.place}.`;
  const stats = [
    { label: `Trek start · ${trailhead.name}`, value: formatAltitudeWithFeet(trailhead.altitudeM), className: "text-ink" },
    { label: `Highest night · ${highestNight.place}`, value: formatAltitudeWithFeet(highestNight.altitudeM), className: "text-whatsapp" },
    { label: `High point · ${peak.place}`, value: formatAltitudeWithFeet(peak.altitudeM), className: "text-brand" },
  ];

  return (
    <section id={TREK_SECTION_IDS.elevation} aria-labelledby="trek-elevation-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
      <SectionHeading id="trek-elevation-title" eyebrow="Acclimatization map" title="Route and elevation profile" />

      <div className={`${PANEL} p-4.5 md:p-6`}>
        <div className="flex items-center justify-between gap-2.5 border-b border-line pb-3">
          <div>
            <h3 className="text-base font-bold">Daily altitude curve</h3>
            <p className="text-xs text-muted-foreground">{sleepNote}</p>
          </div>
          <p className="flex-none rounded-md border border-green-line bg-green-tint px-3 py-1 text-xs font-bold text-whatsapp">
            Peak: {formatAltitude(peak.altitudeM)}
          </p>
        </div>

        {/* Phones scroll the chart sideways rather than shrinking its labels below reading size. */}
        <div
          role="region"
          aria-label="Altitude chart"
          tabIndex={0}
          className="overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ElevationChart profile={profile} />
        </div>

        {/* Phones: one row per figure (label left, value right); wider screens: three centred columns. */}
        <dl className="grid gap-2 border-t border-line pt-3 sm:grid-cols-3 sm:text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline justify-between gap-3 sm:flex-col sm:items-stretch sm:justify-start sm:gap-0">
              <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{stat.label}</dt>
              <dd className={`font-display text-body-sm font-bold whitespace-nowrap sm:mt-0.5 ${stat.className}`}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

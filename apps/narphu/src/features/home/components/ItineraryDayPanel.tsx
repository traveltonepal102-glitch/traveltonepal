import { ClampedText } from "@/components/shared/ClampedText";
import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

const CHIP = "inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm leading-5 font-semibold text-maroon-deep";

/** One day of the itinerary in full (design: the day panel): its photo, title, times and altitudes, and its text folded after seven lines. */
export const ItineraryDayPanel = ({ day, count }: { day: HomeDay; count: number }) => (
  <article aria-labelledby={`day-${day.number}-h`} className="overflow-hidden rounded-3xl bg-paper text-text">
    {day.photo && (
      <div className="relative h-75 bg-maroon-tint max-sm:h-52">
        <SiteImage image={day.photo} sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
        {day.isHighPoint && <span className="absolute top-5 left-5 rounded-full bg-saffron px-3 py-1 text-[13px] leading-4.5 font-bold text-ink">Highest point of the trek</span>}
      </div>
    )}
    <div className="flex flex-col gap-3.5 p-7 max-sm:p-5">
      <span className="eyebrow eyebrow-dash">
        Day {day.number} of {count}
      </span>
      <h3 id={`day-${day.number}-h`} className="text-[30px]! leading-9!">
        {day.title}
      </h3>
      {day.subtitle && <p className="m-0 text-[15px] leading-5.5 font-semibold text-maroon">{day.subtitle}</p>}
      <p className="m-0 flex flex-wrap gap-2">
        {day.duration && (
          <span className={CHIP}>
            <TrailIcon name="clock" size={14} />
            {day.duration}
          </span>
        )}
        <span className={CHIP}>
          <TrailIcon name="mountain" size={14} />
          Highest {formatAltitude(day.altitudeM)}
          {day.topPlace && day.altitudeM !== day.nightAltitudeM ? ` · ${day.topPlace}` : ""}
        </span>
        <span className={CHIP}>
          <TrailIcon name="bed" size={14} />
          Night {formatAltitude(day.nightAltitudeM)}
        </span>
      </p>
      <ClampedText lines={7} className="text-[17px] leading-7">
        <RichText doc={day.body} className="flex flex-col gap-3.5" headingLevel={4} />
      </ClampedText>
    </div>
  </article>
);

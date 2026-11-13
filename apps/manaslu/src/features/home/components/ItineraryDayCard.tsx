import { ClampedText } from "@/components/shared/ClampedText";
import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

const CHIP = "inline-flex items-center gap-1.5 rounded-full bg-forest-tint px-2.5 py-0.75 text-sm leading-5 font-semibold text-forest-deep";

/** One day on the timeline, its photo beside its long text (folded behind "Read more"); the highest point stands out in saffron. */
export const ItineraryDayCard = ({ day }: { day: HomeDay }) => (
  <li className="grid grid-cols-[56px_minmax(0,1fr)] gap-4.5 max-sm:grid-cols-[44px_minmax(0,1fr)] max-sm:gap-3">
    <div className="relative flex justify-center">
      <span aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-line" />
      <span
        aria-hidden="true"
        className={`relative mt-1 inline-flex size-13 flex-col items-center justify-center gap-0.75 rounded-[14px] leading-none shadow-[0_0_0_5px_#fff] max-sm:size-11 ${day.isHighPoint ? "bg-saffron text-ink" : "bg-forest text-snow"}`}
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">Day</span>
        <span className="font-display text-xl font-[640]">{day.number}</span>
      </span>
    </div>
    <article className={`mb-4 flex min-w-0 flex-col gap-2.5 rounded-[14px] border border-solid px-5.5 py-5 max-sm:px-4 ${day.isHighPoint ? "border-saffron-line bg-saffron-tint" : "border-line bg-snow"}`}>
      <h3 className="text-xl! leading-6.75!">
        Day {day.number}: {day.title}
      </h3>
      {day.subtitle && (
        <p className="flex items-start gap-2 text-[15px] leading-5.5 font-semibold text-forest">
          <TrailIcon name="star" size={16} className="mt-0.75" />
          <span>{day.subtitle}</span>
        </p>
      )}
      <p className="flex flex-wrap gap-1.5">
        {day.duration && (
          <span className={CHIP}>
            <TrailIcon name="clock" size={14} />
            {day.duration}
          </span>
        )}
        <span className={CHIP}>
          <TrailIcon name="mountain" size={14} />
          {formatAltitude(day.altitudeM)}
        </span>
        {day.isHighPoint && <span className="inline-flex items-center rounded-full bg-saffron px-2.5 py-0.75 text-sm leading-5 font-semibold text-ink">High point</span>}
      </p>
      {/* The day's photo (from the trek editor) beside the text, above it on a phone. */}
      <div className="flex flex-wrap gap-4">
        {day.photo && (
          <div className="relative h-42.5 w-full flex-none overflow-hidden rounded-[10px] bg-forest-tint sm:h-28 sm:w-40">
            <SiteImage image={day.photo} sizes="(min-width: 640px) 160px, 100vw" className="object-cover" />
          </div>
        )}
        <ClampedText className="min-w-0 flex-[1_1_260px] text-base leading-6.5">
          <RichText doc={day.body} className="flex flex-col gap-3" headingLevel={4} />
        </ClampedText>
      </div>
    </article>
  </li>
);

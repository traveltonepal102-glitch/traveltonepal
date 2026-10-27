import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { SourceNote } from "@/components/editor/SourceNote";
import { secondaryButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import { elevationSummary } from "../../../lib/elevationSummary";
import type { DayAltitude } from "../../../lib/elevationSummary";
import type { TrekValues } from "../../../types";
import { AltitudeChart } from "../itinerary/AltitudeChart";
import { PageHeadingFields } from "../PageHeadingFields";

type ElevationCardProps = {
  values: TrekValues;
  /** The days' altitudes as typed in Day-by-day itinerary (not only as last saved). */
  days: DayAltitude[];
  errors: FieldErrors;
  /** Opens a day in Day-by-day itinerary, at its altitude fields. */
  onSelectDay: (index: number) => void;
  /** Opens Day-by-day itinerary. */
  onEditDays: () => void;
};

const metres = (value: number) => `${value.toLocaleString("en")} m`;

const BOX = "flex flex-col rounded-lg border border-dashed border-line-strong px-3 py-2 text-left";

/**
 * "Route and elevation profile" (the page's "Acclimatization map"): heading, note, and the chart and its three boxes,
 * drawn from the days. The altitudes are changed in the days: a point or a box opens its day there.
 */
export const ElevationCard = ({ values, days, errors, onSelectDay, onEditDays }: ElevationCardProps) => (
  <>
    <PageHeadingFields
      title="Heading above the altitude chart"
      eyebrow="Acclimatization map"
      level="H2"
      heading={{ name: "elevationHeading", defaultValue: values.elevationHeading, placeholder: "Route and elevation profile", error: errors.elevationHeading }}
      line={{
        name: "elevationNote",
        label: "Note next to the chart",
        defaultValue: values.elevationNote,
        placeholder: "You sleep no higher than 3,870 m and only day hike to the high point.",
        maxLength: LIMIT.elevationNote,
        error: errors.elevationNote,
      }}
    />
    <FormSection
      title="Altitude chart"
      hint="Drawn by itself from each day's altitudes, and updates as you edit them. Click a point or a box to change that day."
      aside={
        <button type="button" onClick={onEditDays} className={cn(secondaryButton, "min-h-8 flex-none px-3 text-caption")}>
          <Icon name="edit" size={16} />
          Edit altitudes
        </button>
      }
    >
      <SourceNote shownIn="“Route and elevation profile” on the trek page" from={{ section: "itinerary" }} className="-mt-2" />
      <AltitudeChart days={days} onSelectDay={onSelectDay} />
      <ul className="m-0 grid list-none gap-2.5 p-0 tablet:grid-cols-3">
        {elevationSummary(days).map((box) => {
          const content = (
            <>
              <span className="text-xs font-bold text-muted-foreground">
                {box.label}
                {box.place && ` · ${box.place}`}
              </span>
              <span className="font-bold text-ink">{box.altitudeM === null ? "—" : metres(box.altitudeM)}</span>
              <span className="text-[11px] text-muted-foreground">{box.dayIndex === null ? "From the days" : `Day ${box.dayIndex + 1} · click to change`}</span>
            </>
          );
          const { dayIndex } = box;
          return (
            <li key={box.label}>
              {dayIndex === null ? (
                <div className={BOX}>{content}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectDay(dayIndex)}
                  className={cn(BOX, "m-0 w-full cursor-pointer bg-surface font-sans hover:border-brand focus-visible:outline-2 focus-visible:outline-ring")}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </FormSection>
  </>
);

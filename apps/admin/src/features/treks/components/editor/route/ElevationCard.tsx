import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import type { ItineraryDay, TrekValues } from "../../../types";
import { AltitudeChart } from "../itinerary/AltitudeChart";
import { PageHeadingFields } from "../PageHeadingFields";

type ElevationCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

const metres = (value: number) => `${value.toLocaleString("en")} m`;

/** Where a night is spent: the sleep altitude, or the day's altitude when it is the same. */
const nightAltitude = (day: ItineraryDay) => day.sleepAltitudeM ?? day.altitudeM;

/**
 * The trek page's three boxes beside the chart, from the days: where trekking starts (the first day with a
 * walking or drive time), the highest night and the high point.
 */
const elevationSummary = (days: ItineraryDay[]) => {
  const start = days.find((day) => day.duration.trim() && day.altitudeM !== null);
  const nights = days.filter((day) => nightAltitude(day) !== null);
  const highestNight = nights.reduce<ItineraryDay | null>((best, day) => (best && (nightAltitude(best) ?? 0) >= (nightAltitude(day) ?? 0) ? best : day), null);
  const climbs = days.filter((day) => day.altitudeM !== null);
  const highPoint = climbs.reduce<ItineraryDay | null>((best, day) => (best && (best.altitudeM ?? 0) >= (day.altitudeM ?? 0) ? best : day), null);
  return [
    { label: "Trek start", day: start, altitude: start?.altitudeM ?? null },
    { label: "Highest night", day: highestNight, altitude: highestNight ? nightAltitude(highestNight) : null },
    { label: "High point", day: highPoint, altitude: highPoint?.altitudeM ?? null },
  ];
};

/** "Route and elevation profile" (the page's "Acclimatization map"): heading, note and the chart, drawn from the days. */
export const ElevationCard = ({ values, errors }: ElevationCardProps) => (
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
    <FormSection title="Altitude chart" hint="Drawn by itself from the days (as last saved). To change it, change the altitudes in Day-by-day itinerary.">
      <AltitudeChart altitudes={values.itinerary.map((day) => day.altitudeM)} />
      <ul className="m-0 grid list-none gap-2.5 p-0 tablet:grid-cols-3">
        {elevationSummary(values.itinerary).map((box) => (
          <li key={box.label} className="flex flex-col rounded-lg border border-dashed border-line-strong px-3 py-2">
            <span className="text-xs font-bold text-muted-foreground">
              {box.label}
              {box.day?.place && ` · ${box.day.place}`}
            </span>
            <span className="font-bold text-ink">{box.altitude === null ? "—" : metres(box.altitude)}</span>
            <span className="text-[11px] text-muted-foreground">From the days</span>
          </li>
        ))}
      </ul>
    </FormSection>
  </>
);

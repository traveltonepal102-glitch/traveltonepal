import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../constants";
import type { RegionValues } from "../../types";

type WhereSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
};

type LineKey = "fromKathmandu" | "nearestAirport" | "permitsDetails" | "whereYouSleep";

/** The card's lines, in the website's order. */
const LINES: { key: LineKey; label: string; icon: IconName; placeholder: string; max: number }[] = [
  { key: "fromKathmandu", label: "From Kathmandu", icon: "route", placeholder: "120 km · 7–8 hours by jeep to Syabrubesi", max: LIMIT.fromKathmandu },
  { key: "nearestAirport", label: "Nearest airport", icon: "flight_takeoff", placeholder: "Kathmandu (KTM)", max: LIMIT.nearestAirport },
  { key: "permitsDetails", label: "Permits", icon: "description", placeholder: "Langtang National Park + local area permit", max: LIMIT.permitsDetails },
  { key: "whereYouSleep", label: "Where you sleep", icon: "hotel", placeholder: "Family-run teahouses", max: LIMIT.whereYouSleep },
];

/** "Where it is" (the website's location card): the pin on the map of Nepal, and four lines on getting there. */
export const WhereSection = ({ values, errors }: WhereSectionProps) => (
  <>
    <FormSection title="Pin on the map of Nepal" hint="The pin on this card, and on the maps of the Regions page and the home page.">
      <div className="grid gap-3 tablet:grid-cols-3">
        <TextField name="latitude" label="Latitude" inputMode="decimal" placeholder="28.2100" defaultValue={values.latitude?.toString()} error={errors.latitude} />
        <TextField name="longitude" label="Longitude" inputMode="decimal" placeholder="85.5600" defaultValue={values.longitude?.toString()} error={errors.longitude} />
        <TextField name="pinLabel" label="Label next to the pin" defaultValue={values.pinLabel} error={errors.pinLabel} maxLength={LIMIT.pinLabel} />
      </div>
      <p className="m-0 flex items-start gap-2.5 rounded-md border border-solid border-border bg-page px-3 py-2.5 text-caption">
        <Icon name="info" size={18} className="flex-none text-brand" />
        How to find the numbers: open Google Maps, right-click the main village of the region (for Langtang, Kyanjin Gompa), and click the numbers at
        the top of the menu to copy them.
      </p>
    </FormSection>

    <FormSection title="How to get there" hint="The lines under the map, in this order.">
      {LINES.map((line) => (
        <div key={line.key} className="grid items-start gap-3 tablet:grid-cols-[180px_minmax(0,1fr)]">
          <span className="flex items-center gap-2 pt-2.5 text-xs font-bold tracking-wider text-muted-foreground uppercase max-tablet:hidden">
            <Icon name={line.icon} size={20} className="text-brand" />
            {line.label}
          </span>
          <TextField name={line.key} label={line.label} isLabelHidden defaultValue={values[line.key]} placeholder={line.placeholder} maxLength={line.max} error={errors[line.key]} />
        </div>
      ))}
    </FormSection>
  </>
);

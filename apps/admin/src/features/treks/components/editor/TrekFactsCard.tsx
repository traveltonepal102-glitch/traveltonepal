import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { inputClass, tileLabelClass } from "@/components/ui/formStyles";
import { FieldError } from "@/components/ui/FieldError";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT, difficultyOf } from "../../constants";
import type { TrekValues } from "../../types";

type TrekFactsCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

type BoxProps = {
  icon: IconName;
  label: string;
  /** The field's name; without one the box is filled in by itself and `value` is shown. */
  name?: string;
  value: string;
  placeholder?: string;
  /** Where a filled-in box comes from, e.g. "From Day by day". */
  from?: string;
  inputMode?: "numeric";
  maxLength?: number;
  error?: string;
};

/** One box as the page shows it: icon, small label, value. */
const Box = ({ icon, label, name, value, placeholder, from, inputMode, maxLength, error }: BoxProps) => {
  const id = useId();
  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl border border-solid p-2.5", name ? "border-border bg-page" : "border-dashed border-line-strong")}>
      <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
        <Icon name={icon} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <label htmlFor={id} className={tileLabelClass}>
          {label}
        </label>
        {name ? (
          <input
            id={id}
            name={name}
            defaultValue={value}
            placeholder={placeholder}
            inputMode={inputMode}
            maxLength={maxLength}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(inputClass, "h-8 px-2 text-caption font-semibold")}
          />
        ) : (
          <output id={id} className="text-caption font-semibold text-ink">
            {value}
          </output>
        )}
        {from && <span className="text-[11px] text-muted-foreground">{from}</span>}
        <FieldError id={`${id}-error`} message={error} />
      </span>
    </div>
  );
};

const numberText = (value: number | null) => (value === null ? "" : String(value));

/**
 * "Trip overview and key specifications": the 12 boxes under the introduction, in the page's order. Country,
 * difficulty and (with a day-by-day plan) duration and altitude are filled in by themselves.
 */
export const TrekFactsCard = ({ values, errors }: TrekFactsCardProps) => {
  // With a day-by-day plan, its length and highest point are used (set on Save), so they can't be typed here.
  const hasPlan = values.itinerary.length > 0;
  const text = (name: "startFinish" | "dailyWalking" | "guideRatio" | "seasonLabel" | "accommodation" | "transport" | "activity", maxLength: number = LIMIT.fact) => ({
    name,
    value: values[name],
    maxLength,
    error: errors[name],
  });

  return (
    <FormSection
      title="Trip overview and key specifications"
      hint={`The 12 boxes under the introduction. Next to the heading: “Verified route ${values.currentSeason || "…"}” (the season, in Top of the page).`}
    >
      <div className="grid gap-2.5 tablet:grid-cols-2 desktop:grid-cols-3">
        <Box icon="location_on" label="Start / finish" placeholder="Kathmandu / Syabrubesi" {...text("startFinish")} />
        <Box icon="straighten" label="Total distance (km)" name="distanceKm" inputMode="numeric" placeholder="75" value={numberText(values.distanceKm)} from="Shown as “~75 km / 47 miles”" error={errors.distanceKm} />
        <Box icon="timer" label="Daily walking" placeholder="5 to 7 hours a day" {...text("dailyWalking")} />
        <Box icon="groups" label="Guide to trekker" placeholder="1 : 4 + porters" {...text("guideRatio")} />
        <Box icon="public" label="Country" value="Nepal" from="The same on every trek" />
        {hasPlan ? (
          <Box icon="calendar_month" label="Duration" value={`${values.itinerary.length} days`} from="From Day-by-day itinerary" />
        ) : (
          <Box icon="calendar_month" label="Duration (days)" name="days" inputMode="numeric" placeholder="10" value={numberText(values.days)} error={errors.days} />
        )}
        <Box icon="speed" label="Difficulty" value={difficultyOf(values.difficulty).label} from="From Top of the page" />
        {hasPlan ? (
          <Box icon="altitude" label="Max. altitude" value={values.maxAltitudeM === null ? "—" : `${values.maxAltitudeM.toLocaleString("en")} m`} from="From Day-by-day itinerary" />
        ) : (
          <Box icon="altitude" label="Max. altitude (m)" name="maxAltitudeM" inputMode="numeric" placeholder="4,773" value={numberText(values.maxAltitudeM)} error={errors.maxAltitudeM} />
        )}
        <Box icon="wb_sunny" label="Best season" placeholder="Mar–May, Oct–Nov" {...text("seasonLabel")} />
        <Box icon="hotel" label="Accommodation" placeholder="Teahouse and hotel" {...text("accommodation")} />
        <Box icon="route" label="Transport" placeholder="Jeep to Syabrubesi" {...text("transport")} />
        <Box icon="pin_drop" label="Activity" placeholder="Trekking / hiking" {...text("activity", LIMIT.activity)} />
      </div>
    </FormSection>
  );
};

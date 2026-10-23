"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_DAYS, TREK_LIMITS as LIMIT } from "../../../constants";
import { useItineraryDays } from "../../../hooks/useItineraryDays";
import { parseAltitude } from "../../../lib/altitudeProfile";
import type { TrekValues } from "../../../types";
import { AltitudeChart } from "./AltitudeChart";
import { ItineraryDayCard } from "./ItineraryDayCard";

type TrekItinerarySectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  /** The trek's saved photos, to pick a photo for a day. */
  photoChoices: Photo[];
  onEdit: () => void;
};

/** A day's errors, without the "itinerary.<index>." prefix. */
const dayErrors = (errors: FieldErrors, index: number): FieldErrors => {
  const prefix = `itinerary.${index}.`;
  return Object.fromEntries(Object.entries(errors).flatMap(([field, message]) => (field.startsWith(prefix) ? [[field.slice(prefix.length), message]] : [])));
};

/** The plan above the days, the live altitude chart and the days (design: section "itinerary"). */
export const TrekItinerarySection = ({ values, errors, photoChoices, onEdit }: TrekItinerarySectionProps) => {
  const plan = useItineraryDays(values.itinerary, onEdit);
  const altitudes = plan.days.map((day) => parseAltitude(day.altitude));
  const known = altitudes.filter((altitude) => altitude !== null);
  const highest = known.length ? Math.max(...known) : null;

  return (
    <>
      <FormSection title="About the plan" hint="A short paragraph above the days on the trek page.">
        <TextField
          name="itineraryIntro"
          label="Introduction to the days"
          multiline
          rows={3}
          defaultValue={values.itineraryIntro}
          error={errors.itineraryIntro}
          maxLength={LIMIT.itineraryIntro}
          placeholder="e.g. Ten unhurried days from Kathmandu to the glaciers of the upper Langtang valley and back…"
        />
      </FormSection>

      <FormSection
        title="Altitude profile"
        hint="Drawn from each day's highest point. Shown on the trek page."
        aside={
          highest !== null && (
            <span className="rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-saffron-ink">
              Highest: {highest.toLocaleString("en")} m · Day {altitudes.indexOf(highest) + 1}
            </span>
          )
        }
      >
        <AltitudeChart altitudes={altitudes} />
      </FormSection>

      <FormSection
        title={`${plan.days.length} day${plan.days.length === 1 ? "" : "s"}`}
        hint="Click a day to open it. Day numbers follow the order by themselves. The trek's length and highest point come from these days."
      >
        {plan.days.map((day, index) => {
          const ownErrors = dayErrors(errors, index);
          return (
            <ItineraryDayCard
              key={day.key}
              day={day}
              index={index}
              count={plan.days.length}
              isOpen={plan.openKey === day.key || Object.keys(ownErrors).length > 0}
              errors={ownErrors}
              photoChoices={photoChoices}
              onToggleOpen={() => plan.toggleOpen(day.key)}
              onChange={(patch) => plan.update(day.key, patch)}
              onMove={(to) => plan.move(index, to)}
              onDuplicate={() => plan.duplicate(day.key)}
              onRemove={() => plan.remove(day.key)}
              onToggleHighPoint={() => plan.toggleHighPoint(day.key)}
            />
          );
        })}
        <button
          type="button"
          onClick={plan.add}
          disabled={plan.days.length >= MAX_DAYS}
          className={cn(secondaryButton, "min-h-11 w-full border-dashed text-caption")}
        >
          <Icon name="add" size={18} />
          Add a day
        </button>
        <FieldError id="itinerary-error" message={errors.itinerary} />
      </FormSection>
    </>
  );
};

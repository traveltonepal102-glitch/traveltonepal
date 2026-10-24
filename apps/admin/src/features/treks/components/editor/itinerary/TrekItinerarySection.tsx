"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { SortableList } from "@/components/ui/SortableList";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_DAYS, TREK_LIMITS as LIMIT } from "../../../constants";
import { dayPeak, useItineraryDays } from "../../../hooks/useItineraryDays";
import type { TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";
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

/** "Day-by-day itinerary": the heading, the text and route line above the days, and the days. */
export const TrekItinerarySection = ({ values, errors, photoChoices, onEdit }: TrekItinerarySectionProps) => {
  const plan = useItineraryDays(values.itinerary, onEdit);
  const altitudes = plan.days.map(dayPeak);
  const known = altitudes.filter((altitude) => altitude !== null);
  const highest = known.length ? Math.max(...known) : null;

  return (
    <>
      <PageHeadingFields
        eyebrow="Step-by-step route"
        level="H2"
        headingPrefix={`${plan.days.length}-day`}
        heading={{ name: "itineraryHeading", defaultValue: values.itineraryHeading, placeholder: "day-by-day itinerary", error: errors.itineraryHeading }}
      />

      <FormSection title="Above the days">
        <RichTextEditor
          name="itineraryIntro"
          label="Text under the heading"
          defaultValue={values.itineraryIntro}
          error={errors.itineraryIntro}
          maxLength={LIMIT.itineraryIntro}
          onEdit={onEdit}
        />
        <TextField
          name="routeLine"
          label="Route line above the days"
          defaultValue={values.routeLine}
          placeholder="Langtang Valley Trek route overview (Kathmandu – Syabrubesi – Kyanjin Gompa)"
          maxLength={LIMIT.routeLine}
          error={errors.routeLine}
        />
      </FormSection>

      <FormSection
        title={`${plan.days.length} day${plan.days.length === 1 ? "" : "s"}`}
        hint="Click a day to open it. Drag a day by its handle to move it; day numbers follow by themselves. The trek's length, highest point and altitude chart come from these days."
        aside={
          highest !== null && (
            <span className="rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-saffron-ink">
              Highest: {highest.toLocaleString("en")} m · Day {altitudes.indexOf(highest) + 1}
            </span>
          )
        }
      >
        <SortableList items={plan.days} itemLabel={(day, index) => `day ${index + 1}${day.title ? `, ${day.title}` : ""}`} onMove={plan.move} className="gap-2.5">
          {(day, index, handle) => {
            const ownErrors = dayErrors(errors, index);
            return (
              <ItineraryDayCard
                day={day}
                index={index}
                isOpen={plan.openKey === day.key || Object.keys(ownErrors).length > 0}
                errors={ownErrors}
                photoChoices={photoChoices}
                handle={handle}
                onToggleOpen={() => plan.toggleOpen(day.key)}
                onChange={(patch) => plan.update(day.key, patch)}
                onDuplicate={() => plan.duplicate(day.key)}
                onRemove={() => plan.remove(day.key)}
                onToggleHighPoint={() => plan.toggleHighPoint(day.key)}
              />
            );
          }}
        </SortableList>
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

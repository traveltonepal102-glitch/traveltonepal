"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import type { DayRow } from "../../../hooks/useItineraryDays";
import { parseAltitude } from "../../../lib/altitudeProfile";
import { DayPhotoPicker } from "./DayPhotoPicker";

type ItineraryDayCardProps = {
  day: DayRow;
  index: number;
  count: number;
  isOpen: boolean;
  /** Errors for this day: "title", "altitudeM"… (from "itinerary.<index>.…"). */
  errors: FieldErrors;
  photoChoices: Photo[];
  onToggleOpen: () => void;
  onChange: (patch: Partial<DayRow>) => void;
  onMove: (to: number) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleHighPoint: () => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** The line under a closed day's title: "6–7 hrs · 2,470 m · Lama Hotel". */
const summaryOf = (day: DayRow) => {
  const altitude = parseAltitude(day.altitude);
  return [day.duration, altitude === null ? "" : `${altitude.toLocaleString("en")} m`, day.place].filter(Boolean).join(" · ");
};

/** One day: a header that opens and closes it, then its fields. Closed days still send their fields with Save. */
export const ItineraryDayCard = ({ day, index, count, isOpen, errors, photoChoices, onToggleOpen, onChange, onMove, onDuplicate, onRemove, onToggleHighPoint }: ItineraryDayCardProps) => {
  const bodyId = useId();
  const number = index + 1;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-solid bg-surface", hasErrors ? "border-danger" : "border-border")}>
      <div className="flex items-center gap-2 p-2.5">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="m-0 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent p-1 text-left font-sans focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className={cn("flex-none rounded-sm px-2 py-1 text-[11px] font-extrabold tracking-wide", day.isHighPoint ? "bg-saffron text-navy" : "bg-brand-tint text-brand")}>
            DAY {String(number).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-ink">{day.title || "Untitled day"}</span>
            <span className="block truncate text-xs text-muted-foreground">{summaryOf(day) || "Add the walking time, altitude and place"}</span>
          </span>
          {day.isHighPoint && <span className="flex-none rounded-full bg-saffron-tint px-2 py-0.5 text-xs font-bold text-saffron-ink max-tablet:hidden">Highlight day</span>}
          {hasErrors && <Icon name="error" size={18} label="Has errors" className="flex-none text-danger" />}
          <Icon name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} className="flex-none text-muted-foreground" />
        </button>
        <button type="button" className={ghostIconButton} aria-label={`Move day ${number} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
          <Icon name="arrow_upward" size={18} />
        </button>
        <button type="button" className={ghostIconButton} aria-label={`Move day ${number} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
          <Icon name="arrow_downward" size={18} />
        </button>
      </div>

      <div id={bodyId} hidden={!isOpen} className="flex flex-col gap-3 border-t border-solid border-border p-3.5">
        <input type="hidden" name="dayId" value={day.id ?? ""} />
        <input type="hidden" name="dayHighPoint" value={String(day.isHighPoint)} />
        <TextField name="dayTitle" label="Day title" value={day.title} onValueChange={(title) => onChange({ title })} error={errors.title} maxLength={LIMIT.dayTitle} placeholder="e.g. Syabrubesi to Lama Hotel (2,470 m)" />
        <TextField name="daySubtitle" label="Small line under the title" value={day.subtitle} onValueChange={(subtitle) => onChange({ subtitle })} error={errors.subtitle} maxLength={LIMIT.daySubtitle} placeholder="e.g. River gorge · Bamboo and rhododendron forest" />
        <div className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-4">
          <TextField name="dayPlace" label="Place (on the chart)" value={day.place} onValueChange={(place) => onChange({ place })} error={errors.place} maxLength={LIMIT.dayPlace} placeholder="Lama Hotel" />
          <TextField name="dayDuration" label="Walking time" labelNote="(optional)" value={day.duration} onValueChange={(duration) => onChange({ duration })} error={errors.duration} maxLength={LIMIT.dayDuration} placeholder="6–7 hrs" />
          <TextField name="dayAltitude" label="Highest point (m)" inputMode="numeric" value={day.altitude} onValueChange={(altitude) => onChange({ altitude })} error={errors.altitudeM} placeholder="2,470" />
          <TextField
            name="daySleepAltitude"
            label="Sleep altitude (m)"
            labelNote="(if lower)"
            inputMode="numeric"
            value={day.sleepAltitude}
            onValueChange={(sleepAltitude) => onChange({ sleepAltitude })}
            error={errors.sleepAltitudeM}
            placeholder="3,870"
          />
        </div>
        <RichTextEditor
          name="dayDescription"
          label="What happens on this day"
          size="compact"
          defaultValue={day.description}
          onChange={(description) => onChange({ description })}
          error={errors.description}
          maxLength={LIMIT.dayDescription}
        />
        <DayPhotoPicker photo={day.photo} choices={photoChoices} onChange={(photo) => onChange({ photo })} />
        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border pt-3">
          <button type="button" role="switch" aria-checked={day.isHighPoint} onClick={onToggleHighPoint} className={cn(smallButton, day.isHighPoint && "border-saffron bg-saffron-tint text-saffron-ink")}>
            <Icon name="star" size={16} />
            {day.isHighPoint ? "Highlight day (orange on the trek page)" : "Mark as the highlight day"}
          </button>
          <span className="flex-1" />
          <button type="button" onClick={onDuplicate} className={smallButton}>
            <Icon name="content_copy" size={16} />
            Duplicate day
          </button>
          <button type="button" onClick={onRemove} className={cn(smallButton, "text-danger hover:border-danger hover:text-danger")}>
            <Icon name="delete" size={16} />
            Delete day
          </button>
        </div>
      </div>
    </div>
  );
};

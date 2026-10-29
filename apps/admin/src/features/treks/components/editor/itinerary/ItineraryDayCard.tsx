"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { DragHandleProps } from "@/components/ui/SortableList";
import { DragHandle } from "@/components/ui/SortableList";
import { Switch } from "@/components/ui/Switch";
import { hintClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import { dayAltitudesId } from "../../../hooks/useItineraryDays";
import type { DayRow } from "../../../hooks/useItineraryDays";
import type { RegionOption } from "../../../types";
import { parseAltitude } from "../../../lib/altitudeProfile";
import { DayMealsField } from "./DayMealsField";
import { DayPhotoPicker } from "./DayPhotoPicker";

type ItineraryDayCardProps = {
  day: DayRow;
  index: number;
  isOpen: boolean;
  /** Errors for this day: "title", "sleepAltitude"… (from "itinerary.<index>.…"). */
  errors: FieldErrors;
  photoChoices: Photo[];
  /** The regions on the route (main first); a day picks one only when there are several. */
  routeRegions: RegionOption[];
  /** The region this day is in (its own pick, else the day before's), and the day before's. */
  regionName: string;
  previousRegionName: string;
  /** The drag handle that moves the day (from SortableList). */
  handle: DragHandleProps;
  onToggleOpen: () => void;
  onChange: (patch: Partial<DayRow>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleHighPoint: () => void;
};

const metres = (value: string) => parseAltitude(value)?.toLocaleString("en");

/** The line under a closed day's title: "5–7 hrs · up to 4,773 m · sleep 3,870 m · Teahouse, Kyanjin Gompa". */
const summaryOf = (day: DayRow) => {
  const top = metres(day.topAltitude);
  const sleep = metres(day.sleepAltitude);
  return [day.duration, top && `up to ${top} m`, sleep && `sleep ${sleep} m`, day.place].filter(Boolean).join(" · ");
};

/** One day (design: the day card): a header that opens and closes it, then its fields. Closed days still send theirs. */
export const ItineraryDayCard = ({
  day,
  index,
  isOpen,
  errors,
  photoChoices,
  routeRegions,
  regionName,
  previousRegionName,
  handle,
  onToggleOpen,
  onChange,
  onDuplicate,
  onRemove,
  onToggleHighPoint,
}: ItineraryDayCardProps) => {
  const bodyId = useId();
  const regionSelectId = useId();
  const isMultiRegion = routeRegions.length > 1;
  // "Into Manaslu" on the closed day where the trek crosses into a new region.
  const entersRegion = isMultiRegion && index > 0 && regionName !== previousRegionName ? regionName : "";
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-solid bg-surface", hasErrors ? "border-danger" : "border-border")}>
      <div className="flex items-center gap-1 py-2 pr-2.5 pl-1.5">
        <DragHandle {...handle} />
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="m-0 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent p-1 text-left font-sans focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className={cn("flex-none rounded-sm px-2 py-1 text-[11px] font-extrabold tracking-wide", day.isHighPoint ? "bg-saffron text-navy" : "bg-brand-tint text-brand")}>
            DAY {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-ink">{day.title || "Untitled day"}</span>
            <span className="block truncate text-xs text-muted-foreground">{summaryOf(day) || "Add the walking time, altitude and where you sleep"}</span>
          </span>
          {day.photo && <PhotoImage photo={day.photo} alt="" sizes="54px" className="h-10 w-13.5 flex-none rounded-md object-cover max-tablet:hidden" />}
          {entersRegion && <span className="flex-none rounded-md bg-brand-tint px-2 py-0.5 text-[11px] font-extrabold text-brand max-tablet:hidden">Into {entersRegion}</span>}
          {day.isHighPoint && <span className="flex-none rounded-md bg-saffron px-2 py-0.5 text-[11px] font-extrabold text-navy max-tablet:hidden">Highlight day</span>}
          {hasErrors && <Icon name="error" size={18} label="Has errors" className="flex-none text-danger" />}
          <Icon name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} className="flex-none text-muted-foreground" />
        </button>
      </div>

      <div id={bodyId} hidden={!isOpen} className="flex flex-col gap-3 border-t border-solid border-border p-3.5">
        <input type="hidden" name="dayId" value={day.id ?? ""} />
        <input type="hidden" name="dayHighPoint" value={String(day.isHighPoint)} />
        <input type="hidden" name="dayRegionId" value={day.regionId ?? ""} />
        {isMultiRegion && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={regionSelectId} className={labelClass}>
              Region
            </label>
            <select
              id={regionSelectId}
              value={day.regionId && routeRegions.some((region) => region.id === day.regionId) ? day.regionId : ""}
              onChange={(event) => onChange({ regionId: event.target.value || null })}
              aria-describedby={`${regionSelectId}-hint`}
              className={`${inputClass} cursor-pointer pr-8`}
            >
              <option value="">{index === 0 ? `The main region (${routeRegions[0].name})` : `Same as the day before (${previousRegionName})`}</option>
              {routeRegions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            <p id={`${regionSelectId}-hint`} className={hintClass}>
              Pick a region on the day the trek crosses into it; the next days follow. The trek page shows each region&apos;s days.
            </p>
          </div>
        )}
        <TextField name="dayTitle" label="Day title · H3" value={day.title} onValueChange={(title) => onChange({ title })} error={errors.title} maxLength={LIMIT.dayTitle} placeholder="e.g. Syabrubesi to Lama Hotel (2,470 m)" inputClassName="font-bold" />
        <TextField name="daySubtitle" label="Small line under the title" value={day.subtitle} onValueChange={(subtitle) => onChange({ subtitle })} error={errors.subtitle} maxLength={LIMIT.daySubtitle} placeholder="e.g. River gorge · Bamboo and rhododendron forest" />
        <div id={dayAltitudesId(day.key)} className="grid scroll-mt-40 gap-3 tablet:grid-cols-2 desktop:grid-cols-4">
          <TextField name="dayDuration" label="Walking or drive time" value={day.duration} onValueChange={(duration) => onChange({ duration })} error={errors.duration} maxLength={LIMIT.dayDuration} placeholder="6–7 hrs" />
          <TextField name="dayTopAltitude" label="Highest point today (m)" inputMode="numeric" value={day.topAltitude} onValueChange={(topAltitude) => onChange({ topAltitude })} error={errors.topAltitude} placeholder="Only if higher than tonight" />
          <TextField name="daySleepAltitude" label="Sleep altitude (m)" inputMode="numeric" value={day.sleepAltitude} onValueChange={(sleepAltitude) => onChange({ sleepAltitude })} error={errors.sleepAltitude} placeholder="2,470" />
          <TextField name="dayPlace" label="Sleep at" value={day.place} onValueChange={(place) => onChange({ place })} error={errors.place} maxLength={LIMIT.dayPlace} placeholder="Teahouse, Lama Hotel" />
        </div>
        <DayMealsField meals={day.meals} onChange={(meals) => onChange({ meals })} />
        <div className="grid items-start gap-3 tablet:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
          <DayPhotoPicker photo={day.photo} choices={photoChoices} onChange={(photo) => onChange({ photo })} />
          <RichTextEditor
            name="dayDescription"
            label="What happens on this day"
            defaultValue={day.description}
            onChange={(description) => onChange({ description })}
            error={errors.description}
            maxLength={LIMIT.dayDescription}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-text">
            <Switch label="Highlight day" checked={day.isHighPoint} onChange={onToggleHighPoint} />
            Mark as the highlight day (orange on the trek page)
          </label>
          <span className="flex-1" />
          <button type="button" onClick={onDuplicate} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
            <Icon name="content_copy" size={16} />
            Duplicate day
          </button>
          <button type="button" onClick={onRemove} className="m-0 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-2 font-sans text-caption font-bold text-danger hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            <Icon name="delete" size={16} />
            Delete day
          </button>
        </div>
      </div>
    </div>
  );
};

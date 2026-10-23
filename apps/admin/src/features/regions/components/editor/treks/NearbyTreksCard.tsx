"use client";

import { Icon } from "@ttn/ui/icon";
import { useId } from "react";
import type { ChangeEvent } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { SimilarTrekOption } from "@/features/treks/types";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_NEARBY_TREKS, REGION_LIMITS as LIMIT } from "../../../constants";
import type { NearbyTrek } from "../../../types";

type NearbyTreksCardProps = {
  nearbyTreks: NearbyTrek[];
  /** Treks in other regions, A–Z. */
  options: SimilarTrekOption[];
  regionName: string;
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * Treks from other regions that also suit people looking at this one (design: "Nearby treks to suggest"),
 * in order, each with a short label and a note. Sent as nearbyTrekId / nearbyTrekLabel / nearbyTrekNote.
 */
export const NearbyTreksCard = ({ nearbyTreks, options, regionName, errors, onEdit }: NearbyTreksCardProps) => {
  const selectId = useId();
  // A trek removed since the last save drops out here.
  const list = useRowList<NearbyTrek>(nearbyTreks.filter((item) => options.some((option) => option.id === item.trekId)), onEdit);
  const available = options.filter((option) => !list.rows.some((row) => row.trekId === option.id));
  const rowError = (index: number, field: string) => errors[`nearbyTreks.${index}.${field}`];

  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) list.add({ trekId: event.target.value, label: "", note: "" });
  };

  return (
    <FormSection title="Nearby treks to suggest" hint={`Treks from other regions that also suit people looking at ${regionName}. Shown next to its own treks.`}>
      {list.rows.map((row, index) => {
        const trek = options.find((option) => option.id === row.trekId);
        if (!trek) return null;
        return (
          <div key={row.key} className="flex flex-col gap-2.5 rounded-lg border border-solid border-border bg-page p-3">
            <input type="hidden" name="nearbyTrekId" value={row.trekId} />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-16 flex-none items-center justify-center overflow-hidden rounded-md bg-surface text-subtle">
                {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="64px" className="h-full w-full object-cover" /> : <Icon name="landscape" size={22} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-ink">{trek.name}</span>
                <span className="block text-caption text-muted-foreground">
                  {trek.days} days · {trek.regionName}
                </span>
              </span>
              <span className="flex gap-0.5">
                <button type="button" className={ghostIconButton} aria-label={`Move ${trek.name} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
                  <Icon name="arrow_upward" size={18} />
                </button>
                <button type="button" className={ghostIconButton} aria-label={`Remove ${trek.name}`} onClick={() => list.remove(row.key)}>
                  <Icon name="close" size={18} />
                </button>
              </span>
            </div>
            <div className="grid gap-2 tablet:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <TextField
                name="nearbyTrekLabel"
                label={`Label, ${trek.name}`}
                isLabelHidden
                defaultValue={row.label}
                placeholder="e.g. Nearby · same trailhead"
                maxLength={LIMIT.nearbyLabel}
                error={rowError(index, "label")}
              />
              <TextField
                name="nearbyTrekNote"
                label={`Note, ${trek.name}`}
                isLabelHidden
                defaultValue={row.note}
                placeholder="e.g. Village homestays and hot springs. Easy to combine."
                maxLength={LIMIT.nearbyNote}
                error={rowError(index, "note")}
              />
            </div>
          </div>
        );
      })}
      {!list.rows.length && <p className="m-0 text-caption text-muted-foreground">No nearby treks. The region page shows only its own treks.</p>}

      {list.rows.length < MAX_NEARBY_TREKS && available.length > 0 && (
        <div className="flex max-w-105 flex-col gap-1.5">
          <label htmlFor={selectId} className={labelClass}>
            Add a nearby trek
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">Pick a trek…</option>
            {available.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.regionName})
              </option>
            ))}
          </select>
        </div>
      )}
      <FieldError id="nearby-treks-error" message={errors.nearbyTreks} />
    </FormSection>
  );
};

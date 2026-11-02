"use client";

import { Icon } from "@ttn/ui/icon";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { SimilarTrekOption } from "@/features/treks/types";
import type { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../../constants";
import type { MoreTrek } from "../../../types";

type MoreTreksCardProps = {
  /** The treks ticked "Also show" in the list above (RegionTreksSection holds it). */
  list: ReturnType<typeof useRowList<MoreTrek>>;
  /** The region's own treks, including the ones passing through. */
  regionTreks: SimilarTrekOption[];
  regionName: string;
  errors: FieldErrors;
};

/**
 * The treks ticked "Also show", as the region page shows them under the featured one: their order, and a short
 * label and note for each. Sent as moreTrekId / moreTrekLabel / moreTrekNote.
 */
export const MoreTreksCard = ({ list, regionTreks, regionName, errors }: MoreTreksCardProps) => {
  const rowError = (index: number, field: string) => errors[`moreTreks.${index}.${field}`];

  return (
    <FormSection
      title={`Shown under the featured trek (${list.rows.length})`}
      hint={`Tick “Also show” on ${regionName}'s treks above. Here you set their order and, if you like, a label and a note for each.`}
    >
      {list.rows.map((row, index) => {
        const trek = regionTreks.find((option) => option.id === row.trekId);
        if (!trek) return null;
        return (
          <div key={row.key} className="flex flex-col gap-2.5 rounded-lg border border-solid border-border bg-page p-3">
            <input type="hidden" name="moreTrekId" value={row.trekId} />
            <div className="flex items-center gap-3">
              <span className="w-5 flex-none text-center text-caption font-bold text-muted-foreground">{index + 1}</span>
              <span className="inline-flex h-12 w-16 flex-none items-center justify-center overflow-hidden rounded-md bg-surface text-subtle">
                {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="64px" className="h-full w-full object-cover" /> : <Icon name="landscape" size={22} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-ink">{trek.name}</span>
                <span className="block text-caption text-muted-foreground">{trek.days} days</span>
              </span>
              <span className="flex gap-0.5">
                <button type="button" className={ghostIconButton} aria-label={`Move ${trek.name} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
                  <Icon name="arrow_upward" size={18} />
                </button>
                <button type="button" className={ghostIconButton} aria-label={`Don't show ${trek.name}`} onClick={() => list.remove(row.key)}>
                  <Icon name="close" size={18} />
                </button>
              </span>
            </div>
            <div className="grid gap-2 tablet:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <TextField
                name="moreTrekLabel"
                label={`Label, ${trek.name}`}
                isLabelHidden
                defaultValue={row.label}
                placeholder={`Also in ${regionName}`}
                maxLength={LIMIT.moreTrekLabel}
                error={rowError(index, "label")}
              />
              <TextField
                name="moreTrekNote"
                label={`Note, ${trek.name}`}
                isLabelHidden
                defaultValue={row.note}
                placeholder="Blank: the trek's summary"
                maxLength={LIMIT.moreTrekNote}
                error={rowError(index, "note")}
              />
            </div>
          </div>
        );
      })}
      {!list.rows.length && (
        <p className="m-0 text-caption text-muted-foreground">None ticked yet. The region page shows only the featured trek.</p>
      )}
      <FieldError id="more-treks-error" message={errors.moreTreks} />
    </FormSection>
  );
};

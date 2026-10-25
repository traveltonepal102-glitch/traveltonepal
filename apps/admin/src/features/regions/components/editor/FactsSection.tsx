"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { formatBestMonths } from "@ttn/ui/lib/bestMonths";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";
import type { ReactNode } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, tileLabelClass } from "@/components/ui/formStyles";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_DIFFICULTIES, REGION_LIMITS as LIMIT } from "../../constants";
import type { RegionValues } from "../../types";

type FactTileProps = {
  label: string;
  icon: IconName;
  error?: string;
  /** The field; it gets `id` so the label points at it. */
  children: (id: string, describedBy: string | undefined) => ReactNode;
};

/** One fact as the website's facts card shows it: icon, small label and value. */
const FactTile = ({ label, icon, error, children }: FactTileProps) => {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-solid border-border bg-page p-2.5">
      <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
        <Icon name={icon} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <label htmlFor={id} className={tileLabelClass}>
          {label}
        </label>
        {children(id, error ? `${id}-error` : undefined)}
        <FieldError id={`${id}-error`} message={error} />
      </span>
    </div>
  );
};

const tileInput = cn(inputClass, "h-8 px-2 text-caption font-semibold");

type FactsSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
};

/** "Key facts": the six facts on the card under the big photo (the website's facts card), in its order. */
export const FactsSection = ({ values, errors }: FactsSectionProps) => {
  const bestMonths = formatBestMonths(values.monthRatings);

  return (
    <FormSection title="Key facts" hint="Highest point, trek length and difficulty also show as small labels over the big photo.">
      <div className="grid gap-2.5 tablet:grid-cols-2 desktop:grid-cols-3">
        <FactTile label="Highest point (metres)" icon="altitude" error={errors.maxAltitudeM}>
          {(id, describedBy) => (
            <input id={id} name="maxAltitudeM" inputMode="numeric" defaultValue={values.maxAltitudeM ?? ""} placeholder="4984" aria-describedby={describedBy} aria-invalid={describedBy ? true : undefined} className={tileInput} />
          )}
        </FactTile>
        <FactTile label="Trek length" icon="calendar_month" error={errors.trekLength}>
          {(id, describedBy) => (
            <input id={id} name="trekLength" defaultValue={values.trekLength} placeholder="7–12 days" maxLength={LIMIT.fact} aria-describedby={describedBy} aria-invalid={describedBy ? true : undefined} className={tileInput} />
          )}
        </FactTile>
        <FactTile label="Difficulty" icon="speed" error={errors.difficulty}>
          {(id, describedBy) => (
            <select id={id} name="difficulty" defaultValue={values.difficulty ?? ""} aria-describedby={describedBy} aria-invalid={describedBy ? true : undefined} className={cn(tileInput, "cursor-pointer pr-7")}>
              <option value="">Pick…</option>
              {REGION_DIFFICULTIES.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          )}
        </FactTile>
        <FactTile label="Getting there" icon="route" error={errors.gettingThere ?? errors.isFlight}>
          {(id, describedBy) => (
            <span className="flex gap-1.5">
              <input id={id} name="gettingThere" defaultValue={values.gettingThere} placeholder="Drive, 7–8 hrs" maxLength={LIMIT.fact} aria-describedby={describedBy} aria-invalid={describedBy ? true : undefined} className={tileInput} />
              <select name="access" aria-label="Drive or fly" defaultValue={values.isFlight ? "fly" : "drive"} className={cn(tileInput, "w-auto cursor-pointer pr-7")}>
                <option value="drive">Drive</option>
                <option value="fly">Fly</option>
              </select>
            </span>
          )}
        </FactTile>
        <FactTile label="Permits" icon="description" error={errors.permits}>
          {(id, describedBy) => (
            <input id={id} name="permits" defaultValue={values.permits} placeholder="Langtang NP + local" maxLength={LIMIT.fact} aria-describedby={describedBy} aria-invalid={describedBy ? true : undefined} className={tileInput} />
          )}
        </FactTile>
        <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-line-strong p-2.5">
          <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-saffron-tint text-saffron-ink">
            <Icon name="wb_sunny" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className={tileLabelClass}>Best months</span>
            <span className="text-caption font-semibold text-ink">{bestMonths || "—"}</span>
            <span className="text-[11px] text-muted-foreground">From Best time to go (as last saved)</span>
          </span>
        </div>
      </div>
    </FormSection>
  );
};

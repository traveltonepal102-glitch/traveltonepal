"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PROTECTED_AREAS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { TrekValues } from "../../../types";

type LinesAboveHeadingCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

const AREA_OPTIONS = [{ value: "", label: "None" }, ...PROTECTED_AREAS.map((area) => ({ value: area, label: area }))];

/** "Lines above the heading": the green season line and the three tags (design: top of the page). */
export const LinesAboveHeadingCard = ({ values, errors }: LinesAboveHeadingCardProps) => {
  const [season, setSeason] = useState(values.currentSeason);
  // A park typed in before the list had it stays choosable.
  const areaOptions = values.protectedArea && !PROTECTED_AREAS.includes(values.protectedArea) ? [...AREA_OPTIONS, { value: values.protectedArea, label: values.protectedArea }] : AREA_OPTIONS;

  return (
    <FormSection title="Lines above the heading" hint="The small green line and the 3 tags above the big heading.">
      <div className="grid gap-3 tablet:grid-cols-[180px_minmax(0,1fr)]">
        <TextField
          name="currentSeason"
          label="Season"
          value={season}
          onValueChange={setSeason}
          placeholder="2026/2027"
          maxLength={LIMIT.currentSeason}
          error={errors.currentSeason}
        />
        <div className="flex flex-col gap-1.5 text-caption">
          <span className="text-label text-ink">How it shows</span>
          <span className="inline-flex min-h-10.5 flex-wrap items-center gap-x-4 gap-y-1 rounded-md bg-page px-3 text-text">
            <span className="inline-flex items-center gap-1.5 font-semibold text-whatsapp">
              <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
              {season.trim() || "…"} season open · start on any date you choose
            </span>
            <span className="text-muted-foreground">Also “Verified route {season.trim() || "…"}” on the trip overview.</span>
          </span>
        </div>
      </div>
      <div className="grid gap-3 tablet:grid-cols-3">
        <TextField name="category" label="Tag 1 · Trek style" defaultValue={values.category} placeholder="Classic valley trek" maxLength={LIMIT.category} error={errors.category} />
        <SelectField name="protectedArea" label="Tag 2 · Park or protected area" options={areaOptions} defaultValue={values.protectedArea} error={errors.protectedArea} />
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-ink">Tag 3</span>
          <span title="The same on every trek" className="inline-flex min-h-10.5 items-center gap-1.5 self-start rounded-sm border border-solid border-green-line bg-green-tint px-3 text-caption font-semibold text-whatsapp">
            <Icon name="verified" size={16} />
            Locally owned operator
          </span>
        </div>
      </div>
    </FormSection>
  );
};

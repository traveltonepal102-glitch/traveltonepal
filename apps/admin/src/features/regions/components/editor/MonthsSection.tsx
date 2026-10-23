"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import type { MonthRating } from "@/lib/supabase/database.types";

import { MONTH_NAMES, MONTH_RATING_LABELS, NEXT_MONTH_RATING, REGION_LIMITS, SEASONS } from "../../constants";
import type { RegionValues } from "../../types";

const RATING_CLASSES: Record<MonthRating, string> = {
  best: "bg-month-best text-white",
  possible: "bg-month-possible text-navy",
  avoid: "bg-month-avoid text-muted-foreground",
};

type MonthsSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** The 12-month strip (click to change a month) and a note per season (design: section "months"). */
export const MonthsSection = ({ values, errors, onEdit }: MonthsSectionProps) => {
  const [ratings, setRatings] = useState(values.monthRatings);

  const cycle = (month: number) => {
    setRatings((current) => current.map((rating, index) => (index === month ? NEXT_MONTH_RATING[rating] : rating)));
    onEdit();
  };

  return (
    <>
      <FormSection
        title="Best months to trek"
        hint="Click a month to switch: Best → Possible → Not ideal. Shown on the region card, the Regions page season chart and the region page."
      >
        <div className="grid grid-cols-6 gap-1.5 tablet:grid-cols-12">
          {ratings.map((rating, month) => (
            <button
              key={MONTH_NAMES[month]}
              type="button"
              onClick={() => cycle(month)}
              aria-label={`${MONTH_NAMES[month]}: ${MONTH_RATING_LABELS[rating]}. Click to change.`}
              className={cn(
                "m-0 flex cursor-pointer flex-col items-center gap-0.5 rounded-md border-0 py-3 font-sans font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                RATING_CLASSES[rating],
              )}
            >
              <span className="text-body-sm">{MONTH_NAMES[month]}</span>
              <span className="text-[11px] font-semibold">{MONTH_RATING_LABELS[rating]}</span>
            </button>
          ))}
        </div>
        {ratings.map((rating, month) => (
          <input key={MONTH_NAMES[month]} type="hidden" name="monthRatings" value={rating} />
        ))}
        <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground">
          {(Object.keys(RATING_CLASSES) as MonthRating[]).map((rating) => (
            <span key={rating} className="inline-flex items-center gap-1.5">
              <span className={cn("size-3 rounded-[3px]", RATING_CLASSES[rating])} />
              {MONTH_RATING_LABELS[rating]}
            </span>
          ))}
        </div>
        <FieldError id="month-ratings-error" message={errors.monthRatings} />
      </FormSection>

      <FormSection title="Season notes" hint="One or two lines per season, shown under the month strip on the region page.">
        <div className="grid gap-3 tablet:grid-cols-2">
          {SEASONS.map((season) => (
            <TextField
              key={season.key}
              name={`seasons.${season.key}`}
              label={season.label}
              multiline
              rows={2}
              defaultValue={values.seasons[season.key]}
              error={errors[`seasons.${season.key}`]}
              maxLength={REGION_LIMITS.seasonNote}
            />
          ))}
        </div>
      </FormSection>
    </>
  );
};

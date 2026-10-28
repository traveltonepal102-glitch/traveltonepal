"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { FormGroup } from "@/components/editor/FormGroup";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { SelectField } from "@/components/ui/SelectField";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { todayInNepal } from "@/utils/formatDateTime";

import { REVIEW_LIMITS as LIMIT, REVIEW_SOURCES, STAR_OPTIONS } from "../../constants";
import type { ReviewTrekOption, ReviewValues } from "../../types";

type ReviewFieldsProps = { values: ReviewValues; treks: ReviewTrekOption[]; errors: FieldErrors };

/** "The review, word for word": everything copied from the review site, and its link. */
export const ReviewTextFields = ({ values, errors }: Omit<ReviewFieldsProps, "treks">) => {
  const id = useId();

  return (
    <FormGroup title="The review, word for word" where="Home, About and trek pages">
      <p className="m-0 rounded-lg bg-saffron-tint px-3 py-2 text-caption text-saffron-ink">
        Paste the text exactly as the trekker wrote it. Shortening a long review with “…” is fine; changing words is not.
      </p>
      <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
        <SelectField name="source" label="Posted on" options={REVIEW_SOURCES} defaultValue={values.source} error={errors.source} />
        <TextField
          name="url"
          label="Link to this review"
          defaultValue={values.url}
          placeholder="https://maps.app.goo.gl/…"
          maxLength={LIMIT.url}
          hint="On Google Maps: open the review › Share review › Copy link. Visitors can check it there."
          error={errors.url}
        />
      </div>
      <div className="grid gap-3 tablet:grid-cols-2">
        <TextField name="reviewerName" label="Reviewer’s name" defaultValue={values.reviewerName} maxLength={LIMIT.name} hint="As the review site shows it." error={errors.reviewerName} />
        <TextField
          name="reviewerCountry"
          label="Country"
          labelNote="(optional)"
          defaultValue={values.reviewerCountry}
          maxLength={LIMIT.country}
          hint="Only if the review says so (Google doesn't)."
          error={errors.reviewerCountry}
        />
      </div>
      <div className="grid gap-3 tablet:grid-cols-2">
        <SelectField name="rating" label="Stars given" options={STAR_OPTIONS} defaultValue={String(values.rating)} error={errors.rating} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-date`} className={labelClass}>
            Date written
          </label>
          <input
            id={`${id}-date`}
            type="date"
            name="reviewedOn"
            defaultValue={values.reviewedOn}
            max={todayInNepal()}
            aria-invalid={errors.reviewedOn ? true : undefined}
            aria-describedby={errors.reviewedOn ? `${id}-date-error` : undefined}
            className={cn(inputClass, "cursor-pointer")}
          />
          <FieldError id={`${id}-date-error`} message={errors.reviewedOn} />
        </div>
      </div>
      <TextField name="title" label="Title" labelNote="(optional)" defaultValue={values.title} maxLength={LIMIT.title} hint="Only Tripadvisor reviews have one." error={errors.title} />
      <TextField name="quote" label="Review text" multiline rows={7} defaultValue={values.quote} maxLength={LIMIT.quote} showCount error={errors.quote} />
    </FormGroup>
  );
};

/** "Where it shows": the trek it is about (its page shows it), and whether the website shows it at all. */
export const ReviewPlacementFields = ({ values, treks, errors }: ReviewFieldsProps) => (
  <FormGroup title="Where it shows">
    <SelectField
      name="trekId"
      label="About which trek?"
      options={[{ value: "", label: "About the company (no trek)" }, ...treks.map((trek) => ({ value: trek.id, label: trek.name }))]}
      defaultValue={values.trekId ?? ""}
      hint="A trek's review also shows on that trek's page."
      error={errors.trekId}
    />
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink">Show on the website</span>
        <span className="block text-xs text-muted-foreground">Off: kept here, but visitors don&apos;t see it.</span>
      </span>
      <Switch name="isShown" label="Show on the website" defaultChecked={values.isShown} />
    </label>
  </FormGroup>
);

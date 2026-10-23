"use client";

import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { SlugField } from "@/components/ui/SlugField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { slugify } from "@/utils/slugify";

import { MAIN_SITE_TREKS_PREFIX, TREK_LIMITS as LIMIT } from "../../constants";
import type { RegionOption, TrekValues } from "../../types";

type TrekNameCardProps = {
  values: TrekValues;
  errors: FieldErrors;
  regions: RegionOption[];
  isNew: boolean;
};

/** Name, web address, region and the one-line summary (design: "Name and web address"). */
export const TrekNameCard = ({ values, errors, regions, isNew }: TrekNameCardProps) => {
  const [slug, setSlug] = useState(values.slug);
  // A new trek gets its web address from the name until the admin types one.
  const [isSlugTyped, setIsSlugTyped] = useState(!isNew);

  return (
    <FormSection title="Name and web address">
      <TextField
        name="name"
        label="Trek name"
        defaultValue={values.name}
        error={errors.name}
        maxLength={LIMIT.name}
        onValueChange={(name) => !isSlugTyped && setSlug(slugify(name))}
        inputClassName="h-12.5 font-display text-xl font-bold"
      />
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SlugField
          label="Web address"
          prefix={MAIN_SITE_TREKS_PREFIX}
          value={slug}
          onChange={(next) => {
            setIsSlugTyped(true);
            setSlug(next);
          }}
          hint={isNew ? "Made from the name. Lowercase letters, numbers and dashes." : "Changing it moves the page to a new address."}
          error={errors.slug}
        />
        <SelectField
          name="regionId"
          label="Region"
          placeholder="Pick a region"
          options={regions.map((region) => ({ value: region.id, label: region.name }))}
          defaultValue={values.regionId}
          hint="Every trek belongs to one region."
          error={errors.regionId}
        />
      </div>
      <TextField
        name="summary"
        label="Short summary"
        multiline
        rows={2}
        defaultValue={values.summary}
        error={errors.summary}
        maxLength={LIMIT.summary}
        recommendedLength={LIMIT.summaryRecommended}
        showCount
        hint="Used on trek cards and as the starting point for the Google description."
      />
    </FormSection>
  );
};

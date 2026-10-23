"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { hintClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAIN_SITE_REGIONS_PREFIX, REGION_LIMITS as LIMIT } from "../../constants";
import { slugify } from "../../lib/slugify";
import type { RegionValues } from "../../types";
import { BestForPicker } from "./BestForPicker";

type BasicsSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
  isNew: boolean;
  websiteDomain: string | null;
  slug: string;
  onSlugChange: (slug: string) => void;
  onEdit: () => void;
};

/** Name, web addresses, map pin, tagline, introduction and "best for" (design: section "basics"). */
export const BasicsSection = ({ values, errors, isNew, websiteDomain, slug, onSlugChange, onEdit }: BasicsSectionProps) => {
  const id = useId();
  // A new region gets its web address from the name until the admin types one.
  const [isSlugTyped, setIsSlugTyped] = useState(!isNew);

  const handleNameChange = (name: string) => {
    if (!isSlugTyped) onSlugChange(slugify(name));
  };

  return (
    <>
      <FormSection title="Name and web addresses">
        <div className="grid gap-3 tablet:grid-cols-2">
          <TextField
            name="name"
            label="Region name"
            defaultValue={values.name}
            error={errors.name}
            maxLength={LIMIT.name}
            onValueChange={handleNameChange}
            inputClassName="h-12.5 font-display text-xl font-bold"
          />
          <TextField
            name="district"
            label="District or area"
            defaultValue={values.district}
            error={errors.district}
            maxLength={LIMIT.district}
            inputClassName="h-12.5"
          />
        </div>
        <div className="grid gap-3 tablet:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor={`${id}-slug`} className={labelClass}>
              Page on the main site
            </label>
            <div className="flex">
              <span className="inline-flex h-10.5 items-center rounded-l-md border border-r-0 border-solid border-input bg-page px-2.5 text-caption whitespace-nowrap text-muted-foreground max-tablet:hidden">
                {MAIN_SITE_REGIONS_PREFIX}
              </span>
              <input
                id={`${id}-slug`}
                name="slug"
                value={slug}
                maxLength={LIMIT.slug}
                onChange={(event) => {
                  setIsSlugTyped(true);
                  onSlugChange(event.target.value);
                }}
                aria-invalid={errors.slug ? true : undefined}
                aria-describedby={`${id}-slug-hint ${id}-slug-error`}
                className={cn(inputClass, "tablet:rounded-l-none")}
              />
            </div>
            <p id={`${id}-slug-hint`} className={hintClass}>
              {isNew ? "Made from the name. Lowercase letters, numbers and dashes." : "Changing it moves the page to a new address."}
            </p>
            <FieldError id={`${id}-slug-error`} message={errors.slug} />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor={`${id}-domain`} className={labelClass}>
              Own website <span className="font-medium text-muted-foreground">(set by the developer)</span>
            </label>
            <div className="relative">
              <Icon name="lock" size={18} className="pointer-events-none absolute top-3 left-3 text-muted-foreground" />
              <input id={`${id}-domain`} value={websiteDomain ?? "Not set yet"} readOnly className={cn(inputClass, "pl-9.5")} />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Location on the Nepal map"
        hint="Places the region pin on the map on the Regions page and the home page. Routes are drawn on each trek, not here."
      >
        <div className="grid gap-3 tablet:grid-cols-3">
          <TextField name="latitude" label="Latitude" inputMode="decimal" placeholder="28.2100" defaultValue={values.latitude?.toString()} error={errors.latitude} />
          <TextField name="longitude" label="Longitude" inputMode="decimal" placeholder="85.5600" defaultValue={values.longitude?.toString()} error={errors.longitude} />
          <TextField name="pinLabel" label="Label next to the pin" defaultValue={values.pinLabel} error={errors.pinLabel} maxLength={LIMIT.pinLabel} />
        </div>
        <p className="m-0 flex items-start gap-2.5 rounded-md border border-solid border-border bg-page px-3 py-2.5 text-caption">
          <Icon name="info" size={18} className="flex-none text-brand" />
          How to find the numbers: open Google Maps, right-click the main village of the region (for Langtang, Kyanjin Gompa),
          and click the numbers at the top of the menu to copy them.
        </p>
      </FormSection>

      <FormSection title="Text" hint="The tagline shows on the region card. The intro opens the region page.">
        <TextField name="tagline" label="Tagline" defaultValue={values.tagline} error={errors.tagline} maxLength={LIMIT.tagline} showCount />
        <RichTextEditor
          name="introduction"
          label="Introduction"
          defaultValue={values.introduction}
          error={errors.introduction}
          maxLength={LIMIT.introduction}
          hint="Press Enter for a new paragraph. Select words to make them bold, italic or a link."
          onEdit={onEdit}
        />
        <BestForPicker defaultValue={values.bestFor} error={errors.bestFor} onEdit={onEdit} />
      </FormSection>
    </>
  );
};

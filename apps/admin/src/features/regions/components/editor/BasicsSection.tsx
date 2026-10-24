"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { SlugField } from "@/components/ui/SlugField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { slugify } from "@/utils/slugify";

import { MAIN_SITE_REGIONS_PREFIX, REGION_LIMITS as LIMIT } from "../../constants";
import type { RegionValues } from "../../types";

type BasicsSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
  isNew: boolean;
  websiteDomain: string | null;
  slug: string;
  onSlugChange: (slug: string) => void;
};

/**
 * "Top of the page" (the website's hero): name and web address, the lines over the big photo, and the region's
 * card on the Regions page.
 */
export const BasicsSection = ({ values, errors, isNew, websiteDomain, slug, onSlugChange }: BasicsSectionProps) => {
  const id = useId();
  // A new region gets its web address from the name until the admin types one.
  const [isSlugTyped, setIsSlugTyped] = useState(!isNew);

  const handleNameChange = (name: string) => {
    if (!isSlugTyped) onSlugChange(slugify(name));
  };

  return (
    <>
      <FormSection title="Name and web address">
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
          <TextField name="district" label="District or area" hint="Shown as “Rasuwa, Nepal” over the photo." defaultValue={values.district} error={errors.district} maxLength={LIMIT.district} inputClassName="h-12.5" />
        </div>
        <div className="grid gap-3 tablet:grid-cols-2">
          <SlugField
            label="Page on the main site"
            prefix={MAIN_SITE_REGIONS_PREFIX}
            value={slug}
            onChange={(next) => {
              setIsSlugTyped(true);
              onSlugChange(next);
            }}
            hint={isNew ? "Made from the name. Lowercase letters, numbers and dashes." : "Changing it moves the page to a new address."}
            error={errors.slug}
          />
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
        title="Over the big photo"
        hint="The photo itself is the cover in Photos. Over it the website shows four small labels: highest point, trek length and difficulty (from Key facts), then the highlight below."
      >
        <TextField name="tagline" label="Tagline" hint="The line under the region name." defaultValue={values.tagline} error={errors.tagline} maxLength={LIMIT.tagline} showCount multiline rows={2} />
        <TextField
          name="heroHighlight"
          label="Highlight on the photo"
          hint="The fourth small label over the photo: a short selling point, e.g. “No flights needed”."
          defaultValue={values.heroHighlight}
          placeholder="No flights needed"
          maxLength={LIMIT.heroHighlight}
          error={errors.heroHighlight}
        />
      </FormSection>

      <FormSection title="On the Regions page" hint="The region’s card on the Regions page and its line in the compare table.">
        <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <TextField name="shortName" label="Short name" labelNote="(optional)" hint="Where space is tight." defaultValue={values.shortName} placeholder="Tamang Heritage" maxLength={LIMIT.shortName} error={errors.shortName} />
          <TextField
            name="gettingThereDetails"
            label="How to get there, one line"
            defaultValue={values.gettingThereDetails}
            placeholder="Drive to Syabrubesi (7–8 hrs)"
            maxLength={LIMIT.factDetails}
            error={errors.gettingThereDetails}
          />
        </div>
        <TextField
          name="summary"
          label="Card summary"
          hint="One or two lines on the region card."
          multiline
          rows={2}
          defaultValue={values.summary}
          placeholder="Glaciers, yak pastures and the monastery at Kyanjin Gompa, the closest big-mountain valley to Kathmandu."
          maxLength={LIMIT.summary}
          showCount
          error={errors.summary}
        />
      </FormSection>
    </>
  );
};

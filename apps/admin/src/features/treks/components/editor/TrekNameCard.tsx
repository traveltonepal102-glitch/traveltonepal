"use client";

import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { SlugField } from "@/components/ui/SlugField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { slugify } from "@/utils/slugify";

import { MAIN_SITE_TREKS_PREFIX, TREK_LIMITS as LIMIT } from "../../constants";
import type { RegionOption, TrekValues } from "../../types";
import { RouteRegionsField } from "./top/RouteRegionsField";

type TrekNameCardProps = {
  values: TrekValues;
  errors: FieldErrors;
  regions: RegionOption[];
  isNew: boolean;
  onEdit: () => void;
};

/** Name, the big heading (H1), web address, the regions on the route and the summary (design: "Name and big heading"). */
export const TrekNameCard = ({ values, errors, regions, isNew, onEdit }: TrekNameCardProps) => {
  const [slug, setSlug] = useState(values.slug);
  // A new trek gets its web address from the name until the admin types one.
  const [isSlugTyped, setIsSlugTyped] = useState(!isNew);

  return (
    <FormSection title="Name and big heading">
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TextField
          name="name"
          label="Trek name"
          hint="For menus, trek cards, the breadcrumb and the booking form."
          defaultValue={values.name}
          error={errors.name}
          maxLength={LIMIT.name}
          onValueChange={(name) => !isSlugTyped && setSlug(slugify(name))}
          inputClassName="h-12.5 font-display text-xl font-bold"
        />
        <TextField
          name="shortName"
          label="Short name"
          hint="As people say it: “Book the Langtang Trek with us”."
          defaultValue={values.shortName}
          placeholder="Langtang Trek"
          maxLength={LIMIT.shortName}
          error={errors.shortName}
          inputClassName="h-12.5"
        />
      </div>
      <TextField
        name="headline"
        label="Big heading at the top"
        labelNote="H1"
        hint="The title visitors and Google see first. Start with the main keyword."
        defaultValue={values.headline}
        placeholder="Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)"
        maxLength={LIMIT.headline}
        recommendedLength={LIMIT.headingRecommended}
        showCount
        error={errors.headline}
        inputClassName="font-display text-lg font-bold"
      />
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
      <RouteRegionsField
        regionId={values.regionId}
        routeRegionIds={values.routeRegionIds}
        regions={regions}
        errors={{ regionId: errors.regionId, routeRegionIds: errors.routeRegionIds }}
        onEdit={onEdit}
      />
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
        hint="Not shown on the trek page. Used on trek cards and as the starting point for the Google description."
      />
    </FormSection>
  );
};

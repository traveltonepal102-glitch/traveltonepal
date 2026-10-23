"use client";

import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SEASON_OPTIONS, TAG_OPTIONS, TREK_LIMITS as LIMIT } from "../../constants";
import type { TrekValues } from "../../types";

type TrekListingCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

/** How the trek is found on the website's Treks page: season and style filters, "Popular", the card label. */
export const TrekListingCard = ({ values, errors }: TrekListingCardProps) => (
  <FormSection title="On the Treks page" hint="Filters and labels visitors use to find this trek.">
    <ChoiceChips legend="Good seasons" name="seasons" type="checkbox" options={SEASON_OPTIONS} defaultValues={values.seasons} error={errors.seasons} />
    <ChoiceChips legend="Trek style" name="tags" type="checkbox" options={TAG_OPTIONS} defaultValues={values.tags} error={errors.tags} />
    <ChoiceChips
      legend="Popular"
      name="isPopular"
      type="checkbox"
      options={[{ value: "on", label: "Mark as a popular trek" }]}
      defaultValues={values.isPopular ? ["on"] : []}
    />
    <TextField
      name="cardBadge"
      label="Label on the card photo"
      labelNote="(optional)"
      placeholder="e.g. Best value, Short"
      defaultValue={values.cardBadge}
      error={errors.cardBadge}
      maxLength={LIMIT.cardBadge}
    />
  </FormSection>
);

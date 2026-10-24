import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { ArticleOptions, ArticleValues } from "../../../types";
import { RelatedGuidesField } from "./RelatedGuidesField";

type LinksCardProps = {
  values: ArticleValues;
  options: ArticleOptions;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Links": the main trek, the region pages it shows on and "Keep reading". */
export const LinksCard = ({ values, options, errors, onEdit }: LinksCardProps) => (
  <FormSection title="Links">
    <SelectField
      name="mainTrekId"
      label="Main trek for this guide"
      hint="Shown in the “Plan this trek” side box and as “Max … m” on the photo."
      options={[...options.treks.map((trek) => ({ value: trek.id, label: trek.name })), { value: "", label: "None" }]}
      defaultValue={values.mainTrekId ?? ""}
      error={errors.mainTrekId}
    />
    {options.regions.length > 0 && (
      <div className="flex flex-col gap-1">
        <ChoiceChips legend="Regions" name="regionId" type="checkbox" options={options.regions.map((region) => ({ value: region.id, label: region.name }))} defaultValues={values.regionIds} error={errors.regionIds} />
        <span className="text-xs text-muted-foreground">The guide shows on these region pages under “Before you go”.</span>
      </div>
    )}
    <RelatedGuidesField initial={values.relatedIds} articles={options.articles} error={errors.relatedIds} onEdit={onEdit} />
  </FormSection>
);

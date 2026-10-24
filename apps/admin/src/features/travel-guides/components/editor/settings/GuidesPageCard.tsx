import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { Switch } from "@/components/ui/Switch";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { START_HERE_POSITIONS } from "../../../constants";
import type { ArticleValues } from "../../../types";

type GuidesPageCardProps = {
  values: ArticleValues;
  errors: FieldErrors;
};

const START_HERE_OPTIONS = [{ value: "", label: "Not in the list" }, ...START_HERE_POSITIONS.map((number) => ({ value: String(number), label: `Number ${number}` }))];

/** "Travel guides page": the featured card and the "Start here" list. Both are one per website (they move here). */
export const GuidesPageCard = ({ values, errors }: GuidesPageCardProps) => (
  <FormSection title="Travel guides page">
    <label className="flex cursor-pointer items-center gap-3">
      <Switch name="isFeatured" label="Featured guide" defaultChecked={values.isFeatured} />
      <span>
        <span className="block font-semibold text-ink">Featured guide</span>
        <span className="block text-xs text-muted-foreground">The big card at the top. One per website: it moves here from the guide that has it.</span>
      </span>
    </label>
    <SelectField
      name="startHerePosition"
      label="“Start here” list for first-time trekkers"
      hint="Six guides to read before booking. A number already taken moves here."
      options={START_HERE_OPTIONS}
      defaultValue={values.startHerePosition ? String(values.startHerePosition) : ""}
      error={errors.startHerePosition}
    />
  </FormSection>
);

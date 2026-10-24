import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { GUIDE_BADGES, GUIDE_LIMITS as LIMIT } from "../../constants";
import type { TrekkingGuideValues } from "../../types";
import { GuideFormGroup } from "./GuideFormGroup";
import { LanguagesField } from "./LanguagesField";

type GuideAboutFieldsProps = {
  values: TrekkingGuideValues;
  errors: FieldErrors;
  onEdit: () => void;
  onLanguagesChange: (languages: string[]) => void;
};

const numberText = (value: number | null) => (value === null ? "" : String(value));

/** "About them": what the guide card shows on trek, region and About pages. */
export const GuideAboutFields = ({ values, errors, onEdit, onLanguagesChange }: GuideAboutFieldsProps) => (
  <GuideFormGroup title="About them" where="Trek, region and About pages">
    <TextField name="role" label="Role" defaultValue={values.role} placeholder="e.g. Senior trek leader" maxLength={LIMIT.role} error={errors.role} />
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField
        name="yearsGuiding"
        label="Years guiding"
        inputMode="numeric"
        defaultValue={numberText(values.yearsGuiding)}
        placeholder="e.g. 12"
        error={errors.yearsGuiding}
      />
      <TextField
        name="age"
        label="Age"
        labelNote="(optional)"
        inputMode="numeric"
        defaultValue={numberText(values.age)}
        placeholder="Leave empty to hide"
        error={errors.age}
      />
      <TextField
        name="homeVillage"
        label="Home village"
        defaultValue={values.homeVillage}
        placeholder="e.g. Briddim"
        maxLength={LIMIT.homeVillage}
        error={errors.homeVillage}
      />
      <TextField
        name="homeDistrict"
        label="Home district"
        defaultValue={values.homeDistrict}
        placeholder="e.g. Rasuwa"
        maxLength={LIMIT.homeDistrict}
        error={errors.homeDistrict}
      />
    </div>
    <div className="flex flex-col gap-1">
      <ChoiceChips legend="Badge on the photo" name="badge" type="radio" options={GUIDE_BADGES} defaultValues={[values.badge]} error={errors.badge} />
      <span className="text-xs text-muted-foreground">What they are best at. One badge per guide. “Local to the region” shows the first region they lead, e.g. “Langtang local”.</span>
    </div>
    <LanguagesField initial={values.languages} error={errors.languages} onEdit={onEdit} onChange={onLanguagesChange} />
    <TextField
      name="quote"
      label="A line in their own words"
      labelNote="(optional)"
      hint="Shown in quotes on the card. Ask the guide; don’t write it for them."
      defaultValue={values.quote}
      placeholder="“What I love most about this trail is…”"
      maxLength={LIMIT.quote}
      error={errors.quote}
    />
  </GuideFormGroup>
);

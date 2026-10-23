import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { GUIDE_LIMITS as LIMIT, SPECIALTY_ICONS } from "../../constants";
import type { TrekkingGuideValues } from "../../types";

type GuideDetailsFieldsProps = {
  values: TrekkingGuideValues;
  regions: { id: string; name: string }[];
  errors: FieldErrors;
};

const numberText = (value: number | null) => (value === null ? "" : String(value));

/** Who the guide is (the website's guide card): name, role, experience, home, specialty, and the regions they lead. */
export const GuideDetailsFields = ({ values, regions, errors }: GuideDetailsFieldsProps) => (
  <>
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField name="name" label="Full name" defaultValue={values.name} placeholder="First and last name" maxLength={LIMIT.name} error={errors.name} />
      <TextField name="role" label="Role" defaultValue={values.role} placeholder="e.g. Trek leader" maxLength={LIMIT.role} error={errors.role} />
      <TextField
        name="yearsGuiding"
        label="Years guiding"
        inputMode="numeric"
        defaultValue={numberText(values.yearsGuiding)}
        placeholder="e.g. 12"
        error={errors.yearsGuiding}
      />
      <TextField name="age" label="Age" labelNote="(optional)" inputMode="numeric" defaultValue={numberText(values.age)} placeholder="e.g. 38" error={errors.age} />
    </div>
    <TextField
      name="home"
      label="Home village and district"
      defaultValue={values.home}
      placeholder="e.g. Briddim, Rasuwa"
      maxLength={LIMIT.home}
      error={errors.home}
    />
    <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_150px]">
      <TextField
        name="specialty"
        label="Known for"
        hint="Printed on the photo on trek pages."
        defaultValue={values.specialty}
        placeholder="e.g. Langtang local"
        maxLength={LIMIT.specialty}
        error={errors.specialty}
      />
      <SelectField name="specialtyIcon" label="Icon" options={SPECIALTY_ICONS} defaultValue={values.specialtyIcon} error={errors.specialtyIcon} />
    </div>
    {regions.length > 0 && (
      <div className="flex flex-col gap-1">
        <ChoiceChips legend="Regions this guide leads" name="regionId" type="checkbox" options={regions.map((region) => ({ value: region.id, label: region.name }))} defaultValues={values.regionIds} error={errors.regionIds} />
        <span className="text-xs text-muted-foreground">Suggests this guide on treks in these regions, and for the region filter on the website.</span>
      </div>
    )}
  </>
);

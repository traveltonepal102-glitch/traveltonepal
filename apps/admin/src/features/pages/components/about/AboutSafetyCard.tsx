import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutSafety } from "../../aboutTypes";
import { PAGE_LIMITS as LIMIT } from "../../constants";
import { TitledRows } from "./AboutFieldParts";

/** "The one rule above all four": the band after the beliefs, with three safety facts. */
export const AboutSafetyCard = ({ values, errors }: { values: AboutSafety; errors: FieldErrors }) => (
  <FormSection title="Safety above all">
    <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
      <TextField name="safety.eyebrow" label="Small label" defaultValue={values.eyebrow} maxLength={LIMIT.beliefEyebrow} error={errors["safety.eyebrow"]} />
      <TextField name="safety.heading" label="Heading" labelNote="(H2)" defaultValue={values.heading} maxLength={LIMIT.beliefHeading} inputClassName="font-display font-bold" error={errors["safety.heading"]} />
    </div>
    <TitledRows base="safety.facts" title="Three facts" itemLabel="Fact" rows={values.facts} errors={errors} />
  </FormSection>
);

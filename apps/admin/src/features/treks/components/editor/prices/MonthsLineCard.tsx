import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { TrekValues } from "../../../types";
import { HeadingLineEditor } from "../HeadingLineEditor";

type MonthsLineCardProps = {
  values: Pick<TrekValues, "monthsLine">;
  errors: FieldErrors;
  onEdit: () => void;
};

/** The line under the best months' heading ("Best months for the …", worded by the page), e.g. linking to a season guide. */
export const MonthsLineCard = ({ values, errors, onEdit }: MonthsLineCardProps) => (
  <FormSection title="Best months" hint="The heading “Best months for the …” and the month colours come by themselves. Only the line under it is yours.">
    <HeadingLineEditor name="monthsLine" defaultValue={values.monthsLine} error={errors.monthsLine} onEdit={onEdit} />
  </FormSection>
);

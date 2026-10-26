import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { NEXT_STEP_ROWS, PAGE_LIMITS as LIMIT } from "../../constants";
import type { NextStepValues } from "../../types";

type ContactStepsCardProps = { steps: NextStepValues[]; errors: FieldErrors };

/** "What happens next": the numbered steps from first message to booking. */
export const ContactStepsCard = ({ steps, errors }: ContactStepsCardProps) => (
  <FormSection title="What happens next" hint={`Up to ${NEXT_STEP_ROWS} numbered steps. Leave a row empty to leave it out.`}>
    {Array.from({ length: NEXT_STEP_ROWS }, (_, index) => {
      const step = steps[index];
      return (
        <div key={index} className="grid gap-2 rounded-xl border border-solid border-border bg-page p-2.5 tablet:grid-cols-[170px_minmax(0,1fr)]">
          <TextField name="stepWhen" label={`Step ${index + 1}: when`} defaultValue={step?.when ?? ""} placeholder="Today" maxLength={LIMIT.stepWhen} error={errors[`nextSteps.${index}.when`]} />
          <div className="flex flex-col gap-2">
            <TextField name="stepTitle" label="Title" defaultValue={step?.title ?? ""} maxLength={LIMIT.stepTitle} inputClassName="font-bold" error={errors[`nextSteps.${index}.title`]} />
            <TextField name="stepText" label="Text" isLabelHidden multiline rows={2} defaultValue={step?.text ?? ""} maxLength={LIMIT.stepText} error={errors[`nextSteps.${index}.text`]} />
          </div>
        </div>
      );
    })}
  </FormSection>
);

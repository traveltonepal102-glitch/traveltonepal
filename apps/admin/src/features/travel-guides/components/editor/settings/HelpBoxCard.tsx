import { DEFAULT_GUIDE_HELP_BOX as DEFAULT, GUIDE_HELP_BOX_LIMITS as LIMIT } from "@ttn/config/guideHelpBox";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { ArticleValues } from "../../../types";

type HelpBoxCardProps = {
  values: ArticleValues;
  errors: FieldErrors;
};

/**
 * "Help box in the sidebar": the navy box beside the guide with a WhatsApp and an Email button, worded for this
 * guide's topic. An empty field uses the wording shown in it (@ttn/config/guideHelpBox).
 */
export const HelpBoxCard = ({ values, errors }: HelpBoxCardProps) => (
  <FormSection title="Help box in the sidebar" hint="The navy box beside the guide, with a WhatsApp and an Email button. Leave a field empty to use the grey wording.">
    <TextField name="helpHeading" label="Heading" defaultValue={values.helpHeading} placeholder={DEFAULT.heading} maxLength={LIMIT.heading} error={errors.helpHeading} />
    <TextField name="helpText" label="Text" multiline rows={2} defaultValue={values.helpText} placeholder={DEFAULT.text} maxLength={LIMIT.text} error={errors.helpText} />
    <TextField
      name="helpMessage"
      label="Message"
      hint="How the visitor's WhatsApp message or email starts; they finish it before sending."
      multiline
      rows={2}
      defaultValue={values.helpMessage}
      placeholder={DEFAULT.message}
      maxLength={LIMIT.message}
      error={errors.helpMessage}
    />
  </FormSection>
);

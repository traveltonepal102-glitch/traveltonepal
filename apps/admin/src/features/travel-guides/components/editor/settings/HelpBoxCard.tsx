import { DEFAULT_GUIDE_HELP_BOX as DEFAULT, GUIDE_HELP_BOX_LIMITS as LIMIT } from "@ttn/config/guideHelpBox";

import { FormSection } from "@/components/ui/FormSection";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { ArticleValues } from "../../../types";

type HelpBoxCardProps = {
  values: ArticleValues;
  errors: FieldErrors;
};

/**
 * "Sidebar": whether the guide shows the sidebar beside the article ("Plan this trek" and the help box; off for a
 * general guide, which then gets the full width), and the help box: the navy box with a WhatsApp and an Email
 * button, worded for this guide's topic. An empty field uses the wording shown in it (@ttn/config/guideHelpBox).
 */
export const HelpBoxCard = ({ values, errors }: HelpBoxCardProps) => (
  <FormSection title="Sidebar" hint="Beside the guide: the “Plan this trek” card (the main trek in Links) and the help box.">
    <label className="flex cursor-pointer items-center gap-3">
      <Switch name="showSidebar" label="Show the sidebar" defaultChecked={values.showSidebar} />
      <span>
        <span className="block font-semibold text-ink">Show the sidebar</span>
        <span className="block text-xs text-muted-foreground">
          Turn off for a general guide (e.g. “Nepal trekking guide”): the article then takes the full width.
        </span>
      </span>
    </label>
    <p className="text-xs text-muted-foreground">Help box: the navy box with a WhatsApp and an Email button. Leave a field empty to use the grey wording.</p>
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

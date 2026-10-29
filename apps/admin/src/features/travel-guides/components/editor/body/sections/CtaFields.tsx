import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type CtaFieldsProps = {
  heading: string;
  buttonText: string;
  message: string;
  /** e.g. "sections.6" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { heading?: string; buttonText?: string; message?: string }) => void;
};

/**
 * "WhatsApp and email box": a green box with a WhatsApp button (its text typed here), an Email button and a
 * ready-made message for both.
 */
export const CtaFields = ({ heading, buttonText, message, field, errors, onChange }: CtaFieldsProps) => (
  <div className="grid gap-2.5 rounded-lg border border-solid border-green-line bg-green-tint p-3.5 tablet:grid-cols-2">
    <div className="tablet:col-span-2">
      <TextField
        name="sectionCtaHeading"
        label="Heading"
        value={heading}
        onValueChange={(next) => onChange({ heading: next })}
        placeholder="Want to trek Langtang in the best season?"
        maxLength={LIMIT.ctaHeading}
        error={errors[`${field}.heading`]}
      />
    </div>
    <TextField
      name="sectionCtaButton"
      label="Button text"
      value={buttonText}
      onValueChange={(next) => onChange({ buttonText: next })}
      placeholder="Ask about dates on WhatsApp"
      maxLength={LIMIT.ctaButton}
      error={errors[`${field}.buttonText`]}
    />
    <TextField
      name="sectionCtaMessage"
      label="Message that opens in WhatsApp"
      value={message}
      onValueChange={(next) => onChange({ message: next })}
      placeholder="Hi! I read your Langtang season guide and…"
      maxLength={LIMIT.ctaMessage}
      error={errors[`${field}.message`]}
    />
  </div>
);

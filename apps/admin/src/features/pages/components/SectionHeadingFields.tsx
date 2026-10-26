import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../constants";

type SectionHeadingFieldsProps = {
  /** The small label the page shows above the heading, e.g. "Our story" (fixed in the design). */
  eyebrow: string;
  heading: { name: string; value: string; placeholder: string };
  /** The line under the heading, when the section has one. */
  intro?: { name: string; value: string; placeholder: string };
  errors: FieldErrors;
};

/** A section's heading (H2) and the line under it, with the small label above as the page shows it. */
export const SectionHeadingFields = ({ eyebrow, heading, intro, errors }: SectionHeadingFieldsProps) => (
  <div className="flex flex-col gap-3 rounded-xl border border-solid border-border bg-page p-3">
    <span className="text-[11px] font-bold tracking-widest text-brand uppercase">{eyebrow}</span>
    <TextField
      name={heading.name}
      label="Section heading"
      labelNote="(H2)"
      defaultValue={heading.value}
      placeholder={heading.placeholder}
      maxLength={LIMIT.sectionHeading}
      showCount
      inputClassName="font-display font-bold"
      error={errors[heading.name]}
    />
    {intro && <TextField name={intro.name} label="Line under the heading" defaultValue={intro.value} placeholder={intro.placeholder} maxLength={LIMIT.sectionIntro} error={errors[intro.name]} />}
  </div>
);

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import type { ArticleSection, HeadingLevel } from "../../../../types";

type HeadingSection = Extract<ArticleSection, { type: "heading" }>;

type HeadingFieldsProps = {
  section: HeadingSection;
  /** e.g. "sections.2" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: Partial<HeadingSection>) => void;
};

const LEVELS: { value: HeadingLevel; label: string }[] = [
  { value: "h2", label: "H2 · main heading" },
  { value: "h3", label: "H3 · under an H2" },
];

/** "Heading": a heading with no text under it. An H2 also gets its short name in the "In this guide" contents. */
export const HeadingFields = ({ section, field, errors, onChange }: HeadingFieldsProps) => (
  <>
    <SegmentedControl label="Heading level" options={LEVELS} value={section.level} onChange={(level) => onChange({ level })} />
    <TextField
      name="sectionHeading"
      label={section.level === "h2" ? "Heading · H2" : "Heading · H3"}
      value={section.heading}
      onValueChange={(heading) => onChange({ heading })}
      placeholder={section.level === "h2" ? "Walking times between villages" : "From Syabrubesi to Lama Hotel"}
      maxLength={LIMIT.heading}
      error={errors[`${field}.heading`]}
      inputClassName={section.level === "h2" ? "h-11.5 font-display text-lg font-bold" : "font-display font-bold"}
    />
    {section.level === "h2" && (
      <div className="max-w-80">
        <TextField
          name="sectionTocLabel"
          label="Short name in “In this guide”"
          hint="The contents list at the side. One or two words; empty uses the heading."
          value={section.tocLabel}
          onValueChange={(tocLabel) => onChange({ tocLabel })}
          placeholder="Walking times"
          maxLength={LIMIT.tocLabel}
          error={errors[`${field}.tocLabel`]}
        />
      </div>
    )}
  </>
);

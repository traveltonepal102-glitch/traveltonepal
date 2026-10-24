import { TextField } from "@/components/ui/TextField";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import type { ArticleSection } from "../../../../types";

type TextSection = Extract<ArticleSection, { type: "text" }>;

type TextSectionFieldsProps = {
  section: TextSection;
  /** e.g. "sections.2" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: Partial<TextSection>) => void;
};

/** "Heading and text": an H2, its short name in the "In this guide" contents, and the text. */
export const TextSectionFields = ({ section, field, errors, onChange }: TextSectionFieldsProps) => (
  <>
    <TextField
      name="sectionHeading"
      label="Heading · H2"
      value={section.heading}
      onValueChange={(heading) => onChange({ heading })}
      placeholder="Autumn (October to November): the clearest views"
      maxLength={LIMIT.heading}
      error={errors[`${field}.heading`]}
      inputClassName="h-11.5 font-display text-lg font-bold"
    />
    <div className="max-w-80">
      <TextField
        name="sectionTocLabel"
        label="Short name in “In this guide”"
        hint="The contents list at the side. One or two words; empty uses the heading."
        value={section.tocLabel}
        onValueChange={(tocLabel) => onChange({ tocLabel })}
        placeholder="Autumn"
        maxLength={LIMIT.tocLabel}
        error={errors[`${field}.tocLabel`]}
      />
    </div>
    <RichTextEditor
      name="sectionBody"
      label="Text"
      defaultValue={section.body}
      maxLength={LIMIT.text}
      error={errors[`${field}.body`]}
      onChange={(body) => onChange({ body })}
    />
  </>
);

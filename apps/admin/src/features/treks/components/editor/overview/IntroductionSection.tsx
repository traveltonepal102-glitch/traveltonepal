"use client";

import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import type { TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";

type IntroductionSectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Introduction": its heading and the opening text under the photos (the page shows about 60 words, then “Read more”). */
export const IntroductionSection = ({ values, errors, onEdit }: IntroductionSectionProps) => (
  <>
    <PageHeadingFields
      level="H2"
      heading={{ name: "introHeading", defaultValue: values.introHeading, placeholder: "Introduction", error: errors.introHeading }}
    />
    <FormSection title="Introduction" hint="Shown under the photos, below its heading. Visitors see the first lines, then click “Read more”.">
      <RichTextEditor
        name="introduction"
        label="Introduction"
        defaultValue={values.introduction}
        error={errors.introduction}
        maxLength={LIMIT.introduction}
        hint="About the first 60 words show before “Read more”. Press Enter for a new paragraph; select words to make them bold, italic or a link."
        onEdit={onEdit}
      />
    </FormSection>
  </>
);

"use client";

import { PointListEditor } from "@/components/editor/PointListEditor";
import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_HIGHLIGHTS, RECOMMENDED_HIGHLIGHTS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";

type HighlightsSectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Highlights" (the page's "Trek milestones"): the heading, written for Google, and 4 to 6 points. */
export const HighlightsSection = ({ values, errors, onEdit }: HighlightsSectionProps) => (
  <>
    <PageHeadingFields
      eyebrow="Trek milestones"
      level="H2"
      heading={{ name: "highlightsHeading", defaultValue: values.highlightsHeading, placeholder: "Langtang Trek highlights and why you will love this trek", error: errors.highlightsHeading }}
    />
    <FormSection title="Highlights" hint={`${RECOMMENDED_HIGHLIGHTS} to 6. A short title and one sentence each.`}>
      <PointListEditor
        prefix="highlight"
        field="highlights"
        itemLabel="Highlight"
        points={values.highlights}
        maxItems={MAX_HIGHLIGHTS}
        limits={{ title: LIMIT.pointTitle, text: LIMIT.pointText }}
        placeholders={{ title: "e.g. Kyanjin Ri sunrise (4,773 m)", text: "e.g. An early hike to the best viewpoint in the valley." }}
        errors={errors}
        onEdit={onEdit}
      />
    </FormSection>
  </>
);

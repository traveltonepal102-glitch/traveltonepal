"use client";

import { Icon } from "@ttn/ui/icon";

import { PointListEditor } from "@/components/editor/PointListEditor";
import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_HIGHLIGHTS, MAX_SUITABILITY_POINTS, RECOMMENDED_HIGHLIGHTS, TREK_LIMITS as LIMIT } from "../../constants";
import type { TrekValues } from "../../types";

type TrekOverviewSectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

const POINT_LIMITS = { title: LIMIT.pointTitle, text: LIMIT.pointText };

/** Introduction, highlights and "Is this trek for you?" (design: section "overview"; data: the trek page). */
export const TrekOverviewSection = ({ values, errors, onEdit }: TrekOverviewSectionProps) => (
  <>
    <FormSection title="Introduction" hint="Opens the trek page. The first paragraph shows until the visitor clicks “Read more”.">
      <RichTextEditor
        name="introduction"
        label="Introduction"
        defaultValue={values.introduction}
        error={errors.introduction}
        maxLength={LIMIT.introduction}
        hint="Press Enter for a new paragraph. Select words to make them bold, italic or a link."
        onEdit={onEdit}
      />
    </FormSection>

    <FormSection title="Highlights" hint={`${RECOMMENDED_HIGHLIGHTS}–6 points, each a short bold title and one line. Shown near the top of the page.`}>
      <TextField
        name="highlightsHeading"
        label="Section heading"
        labelNote="(written for Google)"
        placeholder="e.g. Langtang Trek highlights and why you will love this trek"
        defaultValue={values.highlightsHeading}
        error={errors.highlightsHeading}
        maxLength={LIMIT.highlightsHeading}
      />
      <PointListEditor
        prefix="highlight"
        field="highlights"
        itemLabel="Highlight"
        points={values.highlights}
        maxItems={MAX_HIGHLIGHTS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Kyanjin Ri sunrise (4,773 m)", text: "e.g. An early hike to the best viewpoint in the valley." }}
        errors={errors}
        onEdit={onEdit}
      />
    </FormSection>

    <FormSection title="Is this trek for you?" hint="Helps people decide honestly. Fewer unhappy surprises, better reviews.">
      <TextField
        name="suitabilityIntro"
        label="Intro line"
        placeholder="e.g. An honest checklist from our guides to help you decide."
        defaultValue={values.suitabilityIntro}
        error={errors.suitabilityIntro}
        maxLength={LIMIT.suitabilityIntro}
      />
      <p className="m-0 flex items-start gap-2 text-caption text-muted-foreground">
        <Icon name="info" size={16} className="mt-0.5 flex-none text-brand" />
        Cover fitness, altitude, skills, comfort and health, so nobody books a trek that doesn’t suit them.
      </p>
      <PointListEditor
        prefix="suitability"
        field="suitabilityPoints"
        itemLabel="Point"
        points={values.suitabilityPoints}
        maxItems={MAX_SUITABILITY_POINTS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Physical demands and fitness", text: "e.g. 5 to 7 hours of walking a day with a light daypack." }}
        errors={errors}
        onEdit={onEdit}
      />
    </FormSection>
  </>
);

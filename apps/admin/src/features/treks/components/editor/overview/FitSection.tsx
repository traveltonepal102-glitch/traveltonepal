"use client";

import { Icon } from "@ttn/ui/icon";

import { PointListEditor } from "@/components/editor/PointListEditor";
import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_SUITABILITY_POINTS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";

type FitSectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Is this trek for you?" (the page's "Trekker suitability guide"): heading, line, and an honest checklist. */
export const FitSection = ({ values, errors, onEdit }: FitSectionProps) => (
  <>
    <PageHeadingFields
      eyebrow="Trekker suitability guide"
      level="H2"
      heading={{ name: "suitabilityHeading", defaultValue: values.suitabilityHeading, placeholder: "Is this trek for you?", error: errors.suitabilityHeading }}
      line={{
        name: "suitabilityIntro",
        defaultValue: values.suitabilityIntro,
        placeholder: "An honest checklist from our guides to help you prepare and decide if the Langtang Valley suits your goals.",
        maxLength: LIMIT.suitabilityIntro,
        error: errors.suitabilityIntro,
      }}
    />
    <FormSection title="Suitability checklist" hint="One topic and an honest answer each. Shown as “Topic: answer”.">
      <PointListEditor
        prefix="suitability"
        field="suitabilityPoints"
        itemLabel="Topic"
        points={values.suitabilityPoints}
        maxItems={MAX_SUITABILITY_POINTS}
        limits={{ title: LIMIT.pointTitle, text: LIMIT.pointText }}
        placeholders={{ title: "e.g. Physical demands and fitness", text: "e.g. 5 to 7 hours of walking a day with a light daypack." }}
        errors={errors}
        onEdit={onEdit}
        layout="rows"
      />
      <p className="m-0 flex items-start gap-2 text-caption text-muted-foreground">
        <Icon name="info" size={16} className="mt-0.5 flex-none text-brand" />
        The box under the list (“Unsure about your fitness? … Ask on WhatsApp”) is the same on every trek.
      </p>
    </FormSection>
  </>
);

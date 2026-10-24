"use client";

import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../../constants";
import type { RegionValues } from "../../../types";
import { BestForPicker } from "../BestForPicker";
import { WhyPointsEditor } from "./WhyPointsEditor";

type AboutSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "About the region" (the website's overview): heading, introduction, "Best for" and the "why trek here" cards. */
export const AboutSection = ({ values, errors, onEdit }: AboutSectionProps) => (
  <FormSection title="Text and cards" hint="Beside them on the page: the “Where it is” card (its own section).">
    <TextField
      name="overviewHeading"
      label="Heading"
      defaultValue={values.overviewHeading}
      placeholder="The valley next door to Kathmandu"
      maxLength={LIMIT.overviewHeading}
      error={errors.overviewHeading}
      inputClassName="font-display text-lg font-bold"
    />
    <RichTextEditor
      name="introduction"
      label="Introduction"
      defaultValue={values.introduction}
      error={errors.introduction}
      maxLength={LIMIT.introduction}
      hint="Press Enter for a new paragraph. Select words to make them bold, italic or a link."
      onEdit={onEdit}
    />
    <BestForPicker defaultValue={values.bestFor} error={errors.bestFor} onEdit={onEdit} />
    <WhyPointsEditor points={values.whyPoints} errors={errors} onEdit={onEdit} />
  </FormSection>
);

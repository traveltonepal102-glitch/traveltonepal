import type { ReactNode } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../constants";
import type { PageTopValues } from "../types";

type PageTopCardProps = {
  values: PageTopValues;
  errors: FieldErrors;
  /** The small label above the heading: what this page calls it, an example and a hint. */
  eyebrow: { label: string; placeholder: string; hint?: string };
  /** Under the card's title, e.g. where the text shows on the page. */
  hint?: string;
  /** Before each field's name when one form holds several pages ("home." → "home.heading"). */
  fieldPrefix?: string;
  /** Extra fields for this page's top, e.g. the photo. */
  children?: ReactNode;
};

/** "Top of the page": the photo (children), the small label, the big heading (H1) and the text under it. */
export const PageTopCard = ({ values, errors, eyebrow, hint = "The first thing visitors read. The big heading is the page's H1 for Google too.", fieldPrefix = "", children }: PageTopCardProps) => {
  const name = (field: string) => `${fieldPrefix}${field}`;
  return (
    <FormSection title="Top of the page" hint={hint}>
      {children}
      <TextField name={name("eyebrow")} label={eyebrow.label} labelNote="(optional)" hint={eyebrow.hint} defaultValue={values.eyebrow} placeholder={eyebrow.placeholder} maxLength={LIMIT.eyebrow} error={errors[name("eyebrow")]} />
      <TextField name={name("heading")} label="Big heading" labelNote="(H1)" defaultValue={values.heading} maxLength={LIMIT.heading} recommendedLength={70} showCount inputClassName="font-display font-bold" error={errors[name("heading")]} />
      <TextField name={name("intro")} label="Text under the heading" multiline rows={3} defaultValue={values.intro} maxLength={LIMIT.intro} showCount error={errors[name("intro")]} />
    </FormSection>
  );
};

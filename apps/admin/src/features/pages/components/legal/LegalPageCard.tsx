"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../../constants";
import type { LegalPageValues } from "../../types";

type LegalPageCardProps = {
  /** The page's slug, before each field's name ("terms.heading"). */
  slug: string;
  values: LegalPageValues;
  /** The reminder shown while the text is not checked by a lawyer. */
  uncheckedNote: string;
  errors: FieldErrors;
};

/** A legal page's title (H1), intro, "last updated" date and "checked by a lawyer" (design: the card above the text). */
export const LegalPageCard = ({ slug, values, uncheckedNote, errors }: LegalPageCardProps) => {
  const [isChecked, setIsChecked] = useState(values.lawyerChecked);
  const [isAutoDate, setIsAutoDate] = useState(values.autoDate);
  const name = (field: string) => `${slug}.${field}`;

  return (
    <>
      {!isChecked && (
        <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-saffron-line bg-saffron-tint px-3.5 py-3 text-caption text-saffron-ink">
          <Icon name="warning" size={18} className="flex-none text-saffron-deep" />
          <span>
            <strong>Template text.</strong> {uncheckedNote}
          </span>
        </p>
      )}
      <FormSection title="Title and date">
        <TextField name={name("heading")} label="Page title" labelNote="(H1)" defaultValue={values.heading} maxLength={LIMIT.legalTitle} inputClassName="font-display font-bold" error={errors[name("heading")]} />
        <TextField name={name("intro")} label="Intro" multiline rows={2} defaultValue={values.intro} maxLength={LIMIT.legalIntro} error={errors[name("intro")]} />
        <div className="grid gap-3 tablet:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${slug}-last-updated`} className={labelClass}>
              Last updated
            </label>
            <input id={`${slug}-last-updated`} type="date" name={name("lastUpdated")} defaultValue={values.lastUpdated} disabled={isAutoDate} className={cn(inputClass, "disabled:opacity-60")} />
            {isAutoDate && <input type="hidden" name={name("lastUpdated")} value={values.lastUpdated} />}
            <label className="flex cursor-pointer items-center gap-2 text-caption text-text">
              <Switch name={name("autoDate")} label="Set to today when I publish" checked={isAutoDate} onChange={(event) => setIsAutoDate(event.target.checked)} />
              Set to today when I publish <span className="text-muted-foreground">(only when the words changed)</span>
            </label>
            {errors[name("lastUpdated")] && <span className="text-caption text-danger">{errors[name("lastUpdated")]}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Checked by a lawyer</span>
            <label className="flex min-h-10 cursor-pointer items-center gap-2 text-caption text-text">
              <Switch name={name("lawyerChecked")} label="Checked by a lawyer" checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} />
              {isChecked ? "Yes, this text was checked" : "Not checked yet"}
            </label>
          </div>
        </div>
      </FormSection>
    </>
  );
};

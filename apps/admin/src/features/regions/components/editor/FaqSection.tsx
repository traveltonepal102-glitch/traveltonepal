"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import { MAX_FAQS, RECOMMENDED_FAQS, REGION_LIMITS } from "../../constants";
import type { RegionFaq } from "../../types";

type FaqRow = RegionFaq & { id: string };

type FaqSectionProps = {
  faqs: RegionFaq[];
  errors: FieldErrors;
  onEdit: () => void;
};

const smallButton = cn(secondaryButton, "min-h-8 self-start px-2.5 text-caption");
const iconButton =
  "m-0 inline-flex size-8.5 flex-none cursor-pointer items-center justify-center rounded-sm border border-solid border-transparent bg-transparent text-text hover:border-input hover:bg-surface hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring";

/** Questions and answers for the region page, in order (design: section "faq"). Saved as faqQuestion/faqAnswer pairs. */
export const FaqSection = ({ faqs, errors, onEdit }: FaqSectionProps) => {
  const [rows, setRows] = useState<FaqRow[]>(() => faqs.map((faq, index) => ({ ...faq, id: `saved-${index}` })));

  const update = (next: FaqRow[]) => {
    setRows(next);
    onEdit();
  };

  const move = (from: number, to: number) => {
    const next = [...rows];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    update(next);
  };

  const add = () => update([...rows, { id: crypto.randomUUID(), question: "", answer: EMPTY_RICH_TEXT }]);
  const remove = (index: number) => update(rows.filter((_, rowIndex) => rowIndex !== index));

  return (
    <FormSection title="Questions and answers" hint="Shown near the bottom of the region page, and to Google.">
      {rows.length < RECOMMENDED_FAQS && (
        <p className="m-0 flex items-center gap-2.5 rounded-md border border-solid border-saffron-line bg-saffron-tint px-3 py-2.5 text-saffron-ink">
          <Icon name="warning" size={18} className="flex-none text-saffron-deep" />
          {rows.length ? `Only ${rows.length} question${rows.length === 1 ? "" : "s"}.` : "No questions yet."} {RECOMMENDED_FAQS}–8
          questions give Google more to show.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={row.id} className="flex gap-2 rounded-xl border border-solid border-border bg-page p-2.5">
          <div className="flex flex-1 flex-col gap-2">
            <TextField
              name="faqQuestion"
              label={`Question ${index + 1}`}
              defaultValue={row.question}
              error={errors[`faqs.${index}.question`]}
              maxLength={REGION_LIMITS.faqQuestion}
              inputClassName="font-bold"
            />
            <RichTextEditor
              name="faqAnswer"
              label={`Answer ${index + 1}`}
              size="compact"
              defaultValue={row.answer}
              error={errors[`faqs.${index}.answer`]}
              maxLength={REGION_LIMITS.faqAnswer}
              onEdit={onEdit}
            />
          </div>
          <div className="flex flex-col gap-1 pt-6">
            <button type="button" className={iconButton} aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => move(index, index - 1)}>
              <Icon name="arrow_upward" size={18} />
            </button>
            <button
              type="button"
              className={iconButton}
              aria-label={`Move question ${index + 1} down`}
              disabled={index === rows.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <Icon name="arrow_downward" size={18} />
            </button>
            <button type="button" className={iconButton} aria-label={`Remove question ${index + 1}`} onClick={() => remove(index)}>
              <Icon name="delete" size={18} />
            </button>
          </div>
        </div>
      ))}

      <button type="button" className={smallButton} onClick={add} disabled={rows.length >= MAX_FAQS}>
        <Icon name="add" size={16} />
        Add question
      </button>
      <FieldError id="faqs-error" message={errors.faqs} />
    </FormSection>
  );
};

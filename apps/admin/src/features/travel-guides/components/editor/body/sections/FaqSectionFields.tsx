import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { emptyFaqItem } from "../../../../lib/sectionDrafts";
import type { KeyedFaqItem } from "../../../../lib/sectionDrafts";
import { MAX_FAQ_ITEMS, SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type FaqSectionFieldsProps = {
  items: KeyedFaqItem[];
  /** e.g. "sections.5" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (items: KeyedFaqItem[]) => void;
};

/** "Questions and answers": each question opens to show its answer. Google gets them as FAQ data. */
export const FaqSectionFields = ({ items, field, errors, onChange }: FaqSectionFieldsProps) => {
  const update = (key: string, patch: Partial<KeyedFaqItem>) => onChange(items.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <>
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((item, index) => {
          const number = index + 1;
          return (
            <li key={item.key} className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-2.5">
              <div className="flex items-start gap-1">
                <div className="min-w-0 flex-1">
                  <TextField
                    name="sectionQuestion"
                    label={`Question ${number}`}
                    value={item.question}
                    onValueChange={(question) => update(item.key, { question })}
                    placeholder="What is the best month for the Langtang Valley Trek?"
                    maxLength={LIMIT.question}
                    error={errors[`${field}.items.${index}.question`]}
                    inputClassName="font-bold"
                  />
                </div>
                <span className="flex gap-0.5 pt-6">
                  <button type="button" className={ghostIconButton} aria-label={`Move question ${number} up`} disabled={index === 0} onClick={() => move(index, index - 1)}>
                    <Icon name="arrow_upward" size={18} />
                  </button>
                  <button type="button" className={ghostIconButton} aria-label={`Remove question ${number}`} onClick={() => onChange(items.filter((other) => other.key !== item.key))}>
                    <Icon name="delete" size={18} />
                  </button>
                </span>
              </div>
              <RichTextEditor
                name="sectionAnswer"
                label={`Answer ${number}`}
                defaultValue={item.answer}
                maxLength={LIMIT.answer}
                size="compact"
                error={errors[`${field}.items.${index}.answer`]}
                onChange={(answer) => update(item.key, { answer })}
              />
            </li>
          );
        })}
      </ol>
      <FieldError id={`${field}-items-error`} message={errors[`${field}.items`]} />
      <button
        type="button"
        onClick={() => onChange([...items, emptyFaqItem()])}
        disabled={items.length >= MAX_FAQ_ITEMS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add question
      </button>
      <span className="text-xs text-muted-foreground">Adds FAQ data, so Google can show these questions under your result.</span>
    </>
  );
};

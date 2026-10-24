import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_CHECK_ITEMS, SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type ChecklistFieldsProps = {
  heading: string;
  items: string[];
  /** e.g. "sections.3" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { heading?: string; items?: string[] }) => void;
};

/** "Checklist": an optional small heading and items shown with green ticks. */
export const ChecklistFields = ({ heading, items, field, errors, onChange }: ChecklistFieldsProps) => (
  <>
    <TextField
      name="sectionChecklistHeading"
      label="Heading"
      labelNote="(optional)"
      value={heading}
      onValueChange={(next) => onChange({ heading: next })}
      placeholder="Before you fly"
      maxLength={LIMIT.heading}
      error={errors[`${field}.heading`]}
    />
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>Items</span>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((item, index) => (
          // Plain text inputs that follow the list, so an item's place is a fine key.
          <li key={index} className="flex items-center gap-2">
            <Icon name="check_circle" size={20} className="flex-none text-whatsapp" />
            <input
              aria-label={`Item ${index + 1}`}
              value={item}
              onChange={(event) => onChange({ items: items.map((other, at) => (at === index ? event.target.value : other)) })}
              placeholder="e.g. Travel insurance that covers trekking altitude"
              maxLength={LIMIT.checkItem}
              aria-invalid={errors[`${field}.items.${index}`] ? true : undefined}
              className={cn(inputClass, "h-9.5 min-w-0 flex-1")}
            />
            <button type="button" className={ghostIconButton} aria-label={`Remove item ${index + 1}`} onClick={() => onChange({ items: items.filter((_, at) => at !== index) })}>
              <Icon name="close" size={16} />
            </button>
          </li>
        ))}
      </ol>
      <FieldError id={`${field}-items-error`} message={errors[`${field}.items`]} />
      <button
        type="button"
        onClick={() => onChange({ items: [...items, ""] })}
        disabled={items.length >= MAX_CHECK_ITEMS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add item
      </button>
    </div>
  </>
);

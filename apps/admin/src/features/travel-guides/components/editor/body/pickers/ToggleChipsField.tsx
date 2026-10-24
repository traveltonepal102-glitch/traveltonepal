import { Icon } from "@ttn/ui/icon";

import { FieldError } from "@/components/ui/FieldError";
import { labelClass } from "@/components/ui/formStyles";

type ToggleChipsFieldProps = {
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  /** Picked values, in the order they were picked. */
  values: string[];
  max: number;
  hint?: string;
  error?: string;
  /** For the error's id, e.g. "sections.4.trekIds". */
  field: string;
  onChange: (values: string[]) => void;
};

/** Chips to pick several things (treks, guides, days), up to `max`; a picked chip shows a tick. */
export const ToggleChipsField = ({ label, options, values, max, hint, error, field, onChange }: ToggleChipsFieldProps) => {
  const isFull = values.length >= max;
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5">
      <span className={labelClass}>
        {label} <span className="font-medium text-muted-foreground">({values.length} of up to {max})</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isOn = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isOn}
              disabled={option.disabled || (!isOn && isFull)}
              onClick={() => onChange(isOn ? values.filter((value) => value !== option.value) : [...values, option.value])}
              className="m-0 inline-flex min-h-8.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-input bg-surface px-3.5 font-sans text-caption font-bold text-text hover:border-brand focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-on-brand"
            >
              {isOn && <Icon name="check" size={16} />}
              {option.label}
            </button>
          );
        })}
      </div>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <FieldError id={`${field}-error`} message={error} />
    </div>
  );
};

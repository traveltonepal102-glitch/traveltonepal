"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";
import type { ChangeEvent, ReactNode } from "react";

import { FieldError } from "./FieldError";
import { labelClass } from "./formStyles";

type ChoiceChipsProps = {
  legend: ReactNode;
  name: string;
  /** "radio": exactly one; "checkbox": any number. */
  type: "radio" | "checkbox";
  /** With `icon`, the chip shows it instead of the tick that marks a chosen chip. */
  options: { value: string; label: string; sublabel?: string; icon?: IconName }[];
  defaultValues: string[];
  onChange?: (values: string[]) => void;
  error?: string;
};

/**
 * Options shown as chips, built on real radio buttons or checkboxes (keyboard, screen readers and forms
 * work as usual). The form sends `name` once per chosen value.
 */
export const ChoiceChips = ({ legend, name, type, options, defaultValues, onChange, error }: ChoiceChipsProps) => {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const inputs = event.currentTarget.form?.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`) ?? [];
    onChange([...inputs].map((input) => input.value));
  };

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className={cn(labelClass, "mb-1.5 p-0")}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type={type}
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              onChange={handleChange}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-8.5 items-center gap-1.5 rounded-full border border-solid border-input bg-surface px-3.5 text-caption font-bold text-text peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring hover:border-brand [&_.chip-tick]:hidden peer-checked:[&_.chip-tick]:block">
              <Icon name={option.icon ?? "check"} size={16} className={option.icon ? undefined : "chip-tick"} />
              {option.label}
              {option.sublabel && <span className="font-medium opacity-80">{option.sublabel}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  );
};

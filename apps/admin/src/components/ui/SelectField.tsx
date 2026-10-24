"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { FieldError } from "./FieldError";
import { hintClass, inputClass, labelClass } from "./formStyles";

type SelectFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  /** First, unselectable line when nothing is chosen yet, e.g. "Pick a region". */
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Visually hidden label (the context already says what it is). */
  isLabelHidden?: boolean;
  className?: string;
  /** Told about each choice (the field stays uncontrolled). */
  onValueChange?: (value: string) => void;
};

/** A labelled native dropdown for admin forms (native: works with keyboards, phones and screen readers). */
export const SelectField = ({ name, label, options, defaultValue = "", placeholder, hint, error, isLabelHidden = false, className, onValueChange }: SelectFieldProps) => {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className={isLabelHidden ? "sr-only" : labelClass}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        onChange={onValueChange && ((event) => onValueChange(event.target.value))}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(inputClass, "cursor-pointer pr-8")}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};

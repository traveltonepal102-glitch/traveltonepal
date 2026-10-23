"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { ChangeEvent, HTMLAttributes } from "react";

import { FieldError } from "./FieldError";
import { hintClass, inputClass, labelClass, textareaClass } from "./formStyles";

type TextFieldProps = {
  name: string;
  label: string;
  /** Lighter words after the label, e.g. "(optional)". */
  labelNote?: string;
  hint?: string;
  error?: string;
  defaultValue?: string;
  /** Pass value and onValueChange to control the field (live previews); otherwise it keeps its own value. */
  value?: string;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  /** Hard limit: the field won't take more. */
  maxLength?: number;
  /** Shows "12 / 60"; amber past this length (still saves up to maxLength). Defaults to maxLength. */
  recommendedLength?: number;
  showCount?: boolean;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  inputClassName?: string;
};

/** Labelled text input or textarea for admin forms, with hint, error and optional character counter. */
export const TextField = ({
  name,
  label,
  labelNote,
  hint,
  error,
  defaultValue = "",
  value,
  onValueChange,
  multiline = false,
  rows = 3,
  maxLength,
  recommendedLength = maxLength,
  showCount = false,
  placeholder,
  inputMode,
  inputClassName,
}: TextFieldProps) => {
  const id = useId();
  const [ownLength, setOwnLength] = useState(defaultValue.length);
  const length = value === undefined ? ownLength : value.length;

  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOwnLength(event.target.value.length);
    onValueChange?.(event.target.value);
  };

  const fieldProps = {
    id,
    name,
    maxLength,
    placeholder,
    onChange: handleChange,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    ...(value === undefined ? { defaultValue } : { value }),
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
          {labelNote && <span className="font-medium text-muted-foreground"> {labelNote}</span>}
        </label>
        {showCount && recommendedLength && (
          <span
            aria-hidden="true"
            className={cn("text-caption font-semibold", length > recommendedLength ? "text-saffron-ink" : "text-whatsapp")}
          >
            {length} / {recommendedLength}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea rows={rows} className={cn(textareaClass, inputClassName)} {...fieldProps} />
      ) : (
        <input type="text" inputMode={inputMode} className={cn(inputClass, inputClassName)} {...fieldProps} />
      )}
      {hint && (
        <p id={hintId} className={hintClass}>
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
};

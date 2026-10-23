"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { MAX_SLUG_LENGTH } from "@/utils/slugify";

import { FieldError } from "./FieldError";
import { hintClass, inputClass, labelClass } from "./formStyles";

type SlugFieldProps = {
  label: string;
  /** The fixed start of the address, e.g. "traveltonepal.com/treks/". */
  prefix: string;
  value: string;
  onChange: (slug: string) => void;
  hint: string;
  error?: string;
};

/** The editable end of a page's web address (the form field "slug"). */
export const SlugField = ({ label, prefix, value, onChange, hint, error }: SlugFieldProps) => {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex">
        <span className="inline-flex h-10.5 items-center rounded-l-md border border-r-0 border-solid border-input bg-page px-2.5 text-caption whitespace-nowrap text-muted-foreground max-tablet:hidden">
          {prefix}
        </span>
        <input
          id={id}
          name="slug"
          value={value}
          maxLength={MAX_SLUG_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint ${id}-error`}
          className={cn(inputClass, "tablet:rounded-l-none")}
        />
      </div>
      <p id={`${id}-hint`} className={hintClass}>
        {hint}
      </p>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};

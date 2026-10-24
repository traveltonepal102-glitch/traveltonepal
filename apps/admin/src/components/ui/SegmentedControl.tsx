"use client";

import { useId } from "react";

type SegmentedControlProps<Value extends string> = {
  label: string;
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
};

/** A few side-by-side choices, one picked (design: the segmented switch), built on radio buttons. */
export const SegmentedControl = <Value extends string>({ label, options, value, onChange }: SegmentedControlProps<Value>) => {
  const name = useId();
  return (
    <fieldset className="m-0 inline-flex rounded-lg border border-solid border-border bg-muted p-0.75">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="peer sr-only" />
          <span className="flex min-h-8 items-center rounded-md px-3 text-caption font-bold text-text peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-ring">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
};

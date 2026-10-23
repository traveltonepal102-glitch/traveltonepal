"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";

import { BEST_FOR_SUGGESTIONS, MAX_BEST_FOR, REGION_LIMITS } from "../../constants";

type BestForPickerProps = {
  defaultValue: string[];
  error?: string;
  onEdit: () => void;
};

const chipClass =
  "m-0 inline-flex min-h-8.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3.5 font-sans text-caption font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

/** "Best for": up to 3 short chips, from the quick picks or typed in. Saved as hidden "bestFor" fields. */
export const BestForPicker = ({ defaultValue, error, onEdit }: BestForPickerProps) => {
  const id = useId();
  const [selected, setSelected] = useState(defaultValue);
  const [draft, setDraft] = useState("");
  const options = [...new Set([...BEST_FOR_SUGGESTIONS, ...selected])];
  const isFull = selected.length >= MAX_BEST_FOR;

  const toggle = (option: string) => {
    setSelected((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
    onEdit();
  };

  const addDraft = () => {
    const option = draft.trim();
    if (!option || isFull || selected.includes(option)) return;
    setSelected((current) => [...current, option]);
    setDraft("");
    onEdit();
  };

  // Enter adds the chip instead of submitting the whole form.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addDraft();
  };

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className={cn(labelClass, "mb-1.5 p-0")}>
        Best for <span className="font-medium text-muted-foreground">(pick up to {MAX_BEST_FOR}, shown as chips)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isOn}
              disabled={!isOn && isFull}
              onClick={() => toggle(option)}
              className={cn(chipClass, isOn ? "border-brand bg-brand text-on-brand" : "border-input bg-surface text-text hover:border-brand")}
            >
              {isOn && <Icon name="check" size={16} />}
              {option}
            </button>
          );
        })}
      </div>
      <div className="flex max-w-105 gap-2">
        <label htmlFor={`${id}-own`} className="sr-only">
          Your own &quot;best for&quot; chip
        </label>
        <input
          id={`${id}-own`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={REGION_LIMITS.bestForItem}
          disabled={isFull}
          placeholder={isFull ? `${MAX_BEST_FOR} picked` : "Or write your own, e.g. Hot springs"}
          className={cn(inputClass, "h-8.5 disabled:bg-page")}
        />
        <button type="button" onClick={addDraft} disabled={isFull || !draft.trim()} className={cn(chipClass, "border-input bg-surface text-text")}>
          <Icon name="add" size={16} />
          Add
        </button>
      </div>
      {selected.map((option) => (
        <input key={option} type="hidden" name="bestFor" value={option} />
      ))}
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  );
};

"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { inputClass, labelClass } from "@/components/ui/formStyles";

import { REPEAT_FREQUENCIES } from "../../constants";
import { WEEKDAY_LABELS } from "../../lib/dates";
import type { RepeatPattern } from "../../lib/dates";

type RepeatPatternFieldsProps = {
  pattern: RepeatPattern;
  onChange: (pattern: RepeatPattern) => void;
};

/** A pressed / not pressed choice button (design: the drawer's segment and weekday chips). */
export const choiceClass = (isOn: boolean) =>
  cn(
    "m-0 min-h-8.5 cursor-pointer rounded-sm border border-solid px-3 font-sans text-caption font-bold",
    isOn ? "border-brand bg-brand text-on-brand" : "border-input bg-surface text-text hover:border-brand",
  );

/** "Repeat a pattern": how often, on which weekday, and between which days. */
export const RepeatPatternFields = ({ pattern, onChange }: RepeatPatternFieldsProps) => {
  const id = useId();

  return (
    <>
      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
        <legend className={cn(labelClass, "mb-1.5 p-0")}>How often</legend>
        <div className="flex flex-wrap gap-1.5">
          {REPEAT_FREQUENCIES.map((frequency) => (
            <button
              key={frequency.value}
              type="button"
              aria-pressed={pattern.everyDays === frequency.value}
              onClick={() => onChange({ ...pattern, everyDays: frequency.value })}
              className={choiceClass(pattern.everyDays === frequency.value)}
            >
              {frequency.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
        <legend className={cn(labelClass, "mb-1.5 p-0")}>Start on</legend>
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAY_LABELS.map((label, weekday) => (
            <button key={label} type="button" aria-pressed={pattern.weekday === weekday} onClick={() => onChange({ ...pattern, weekday })} className={choiceClass(pattern.weekday === weekday)}>
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        {(["from", "until"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-${field}`} className={labelClass}>
              {field === "from" ? "From" : "Until"}
            </label>
            <input
              id={`${id}-${field}`}
              type="date"
              value={pattern[field]}
              onChange={(event) => onChange({ ...pattern, [field]: event.target.value })}
              className={cn(inputClass, "cursor-pointer")}
            />
          </div>
        ))}
      </div>
      <p className="m-0 -mt-2 text-xs text-muted-foreground">Nepal dates: the days the trek starts in Kathmandu.</p>
    </>
  );
};

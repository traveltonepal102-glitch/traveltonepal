"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { inputClass } from "@/components/ui/formStyles";

type StatusSelectProps = {
  options: { value: string; label: string; hint: string }[];
  defaultValue: string;
};

/** The status next to Save in an editor's header (sent as `status`), e.g. "Draft · Not on the website yet". */
export const StatusSelect = ({ options, defaultValue }: StatusSelectProps) => {
  const id = useId();
  return (
    <div className="flex min-w-0 items-center gap-2 max-tablet:flex-1">
      <label htmlFor={id} className="text-caption font-bold text-ink max-tablet:sr-only">
        Status
      </label>
      <select id={id} name="status" defaultValue={defaultValue} className={cn(inputClass, "h-10 w-auto cursor-pointer pr-8 font-semibold max-tablet:w-full")}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} · {option.hint}
          </option>
        ))}
      </select>
    </div>
  );
};

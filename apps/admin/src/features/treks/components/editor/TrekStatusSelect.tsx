"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { inputClass } from "@/components/ui/formStyles";

import { STATUS_OPTIONS } from "../../constants";
import type { TrekStatus } from "../../types";

type TrekStatusSelectProps = {
  defaultValue: TrekStatus;
};

/** Draft / Published / Hidden next to Save (the design shows the status but has no way to change it). */
export const TrekStatusSelect = ({ defaultValue }: TrekStatusSelectProps) => {
  const id = useId();
  return (
    <div className="flex min-w-0 items-center gap-2 max-tablet:flex-1">
      <label htmlFor={id} className="text-caption font-bold text-ink max-tablet:sr-only">
        Status
      </label>
      <select id={id} name="status" defaultValue={defaultValue} className={cn(inputClass, "h-10 w-auto cursor-pointer pr-8 font-semibold max-tablet:w-full")}>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} · {option.hint}
          </option>
        ))}
      </select>
    </div>
  );
};

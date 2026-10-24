"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { DEPARTURE_STATUSES } from "@/features/treks/constants";
import type { DepartureStatus } from "@/features/treks/types";

type StatusButtonsProps = {
  /** What the group is for, e.g. "Status for Langtang Valley Trek, Nov 2". */
  label: string;
  value: DepartureStatus;
  onChange: (status: DepartureStatus) => void;
  /** Sent with a form under this name (the "Add date" form); rows save on change instead. */
  name?: string;
  isDisabled?: boolean;
};

/**
 * The four statuses side by side, one click to change (design: the status segments). Real radio buttons, so the
 * arrow keys move between them and screen readers announce the choice.
 */
export const StatusButtons = ({ label, value, onChange, name, isDisabled = false }: StatusButtonsProps) => {
  const groupName = useId();

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-fit flex-wrap gap-0.5 rounded-md border border-solid border-border bg-page p-0.5">
      {DEPARTURE_STATUSES.map((status) => (
        <label key={status.value} className={cn("cursor-pointer", isDisabled && "cursor-wait")}>
          <input
            type="radio"
            name={name ?? groupName}
            value={status.value}
            checked={value === status.value}
            disabled={isDisabled}
            onChange={() => onChange(status.value)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "inline-flex min-h-8 items-center rounded-sm px-2.5 text-xs font-bold whitespace-nowrap text-muted-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-ring hover:text-ink",
              value === status.value && status.on,
              value === status.value && "hover:text-current",
            )}
          >
            {status.label}
          </span>
        </label>
      ))}
    </div>
  );
};

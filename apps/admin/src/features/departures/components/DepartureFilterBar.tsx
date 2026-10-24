"use client";

import { cn } from "@ttn/ui/lib/utils";

import { inputClass } from "@/components/ui/formStyles";
import { Switch } from "@/components/ui/Switch";
import { DEPARTURE_STATUSES } from "@/features/treks/constants";
import type { DepartureStatus } from "@/features/treks/types";

import type { DepartureFilters } from "../lib/departureList";
import type { DepartureTrek } from "../types";

type DepartureFilterBarProps = {
  filters: DepartureFilters;
  onChange: (filters: DepartureFilters) => void;
  /** The treks that have dates. */
  treks: DepartureTrek[];
  counts: Record<DepartureStatus | "all", number>;
};

const STATUS_CHIPS: { value: DepartureStatus | "all"; label: string }[] = [{ value: "all", label: "All upcoming" }, ...DEPARTURE_STATUSES];

/** Trek, status and "Show past dates" (design: the filter row). */
export const DepartureFilterBar = ({ filters, onChange, treks, counts }: DepartureFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2.5">
    <select
      aria-label="Trek"
      value={filters.trekId}
      onChange={(event) => onChange({ ...filters, trekId: event.target.value })}
      className={cn(inputClass, "w-auto min-w-55 cursor-pointer pr-8 max-tablet:w-full")}
    >
      <option value="">All treks with dates ({treks.length})</option>
      {treks.map((trek) => (
        <option key={trek.id} value={trek.id}>
          {trek.name}
        </option>
      ))}
    </select>
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status">
      {STATUS_CHIPS.map((chip) => {
        const isOn = filters.status === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={isOn}
            onClick={() => onChange({ ...filters, status: chip.value })}
            className={cn(
              "m-0 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 font-sans text-caption font-semibold",
              isOn ? "border-navy bg-navy text-white" : "border-input bg-surface text-text hover:border-brand",
            )}
          >
            {chip.label}
            <span className={cn("rounded-full px-1.5 text-[11px] font-bold", isOn ? "bg-white/20" : "bg-muted text-muted-foreground")}>{counts[chip.value]}</span>
          </button>
        );
      })}
    </div>
    <span className="flex-1 max-desktop:hidden" />
    <label className="inline-flex cursor-pointer items-center gap-2 text-caption font-semibold text-text">
      <Switch name="showPast" label="Show past dates" checked={filters.showPast} onChange={(event) => onChange({ ...filters, showPast: event.target.checked })} />
      Show past dates
    </label>
  </div>
);

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { inputClass } from "@/components/ui/formStyles";

import { usePickerRegions } from "../../hooks/usePickerRegions";
import { filterValue, parseFilterValue } from "../../lib/pickerFilter";
import type { PickerFilter } from "../../lib/pickerSearch";
import { PICKER_QUERY_MAX } from "../../lib/pickerSearch";

type PickerToolbarProps = {
  query: string;
  filter: PickerFilter;
  /** Offers "This trek's photos" (its cover and gallery as saved). */
  trekId: string | null;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: PickerFilter) => void;
};

/** Search by place or file name, and show all photos, this trek's or one region's. */
export const PickerToolbar = ({ query, filter, trekId, onQueryChange, onFilterChange }: PickerToolbarProps) => {
  const id = useId();
  const regions = usePickerRegions();

  return (
    <div className="flex flex-wrap gap-2">
      <label htmlFor={`${id}-search`} className="sr-only">
        Search photos
      </label>
      <span className="relative min-w-50 flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
        <input
          id={`${id}-search`}
          type="search"
          value={query}
          maxLength={PICKER_QUERY_MAX}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by place or file name"
          autoComplete="off"
          className={cn(inputClass, "pl-9")}
        />
      </span>
      <label htmlFor={`${id}-filter`} className="sr-only">
        Show
      </label>
      <select id={`${id}-filter`} value={filterValue(filter)} onChange={(event) => onFilterChange(parseFilterValue(event.target.value))} className={cn(inputClass, "w-auto max-w-full cursor-pointer pr-8")}>
        <option value="all">All photos</option>
        {trekId && <option value={filterValue({ kind: "trek", id: trekId })}>This trek’s photos</option>}
        {regions.length > 0 && (
          <optgroup label="Region">
            {regions.map((region) => (
              <option key={region.id} value={filterValue({ kind: "region", id: region.id })}>
                {region.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { inputClass } from "@/components/ui/formStyles";

import { COMPANY_FILTER } from "../../lib/reviewFilters";
import type { ReviewFilters } from "../../lib/reviewFilters";
import type { ReviewTrekOption } from "../../types";

type ReviewFilterBarProps = {
  filters: ReviewFilters;
  onChange: (filters: ReviewFilters) => void;
  treks: ReviewTrekOption[];
  /** e.g. "12 reviews" or "3 of 12 reviews". */
  countLabel: string;
};

const selectClass = cn(inputClass, "w-auto min-w-40 cursor-pointer pr-8");

const visibilityOf = (value: string): ReviewFilters["visibility"] => (value === "shown" || value === "hidden" ? value : "");

/** Search by name or text, and filter by shown or hidden and by trek (or about the company). */
export const ReviewFilterBar = ({ filters, onChange, treks, countLabel }: ReviewFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2.5 max-tablet:flex-col max-tablet:items-stretch">
    <label className="relative block min-w-55 flex-1 tablet:max-w-90">
      <span className="sr-only">Search reviews</span>
      <Icon name="search" size={20} className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground" />
      <input
        type="search"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search name or text"
        className={cn(inputClass, "pl-10.5")}
      />
    </label>
    <select
      aria-label="Filter by website"
      value={filters.visibility}
      onChange={(event) => onChange({ ...filters, visibility: visibilityOf(event.target.value) })}
      className={selectClass}
    >
      <option value="">Shown and hidden</option>
      <option value="shown">On the website</option>
      <option value="hidden">Hidden</option>
    </select>
    <select aria-label="Filter by trek" value={filters.trek} onChange={(event) => onChange({ ...filters, trek: event.target.value })} className={selectClass}>
      <option value="">Every trek</option>
      <option value={COMPANY_FILTER}>About the company</option>
      {treks.map((trek) => (
        <option key={trek.id} value={trek.id}>
          {trek.name}
        </option>
      ))}
    </select>
    <span className="flex-1 max-tablet:hidden" />
    <span role="status" className="text-xs text-muted-foreground">
      {countLabel}
    </span>
  </div>
);

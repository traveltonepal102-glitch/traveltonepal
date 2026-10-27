"use client";

import { Icon } from "@ttn/ui/icon";

import { DIFFICULTIES } from "../../difficulty";
import { TREK_LENGTHS, TREK_SEASONS } from "../../filters";
import type { TrekFilters } from "../../filtering";
import type { FilterActions, RegionOption } from "./types";

type Chip = { key: string; label: string; remove: Partial<TrekFilters> };

const labelOf = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

/** One removable chip per active filter value. */
const buildChips = (filters: TrekFilters, regions: readonly RegionOption[]): Chip[] => [
  ...(filters.q ? [{ key: "q", label: `“${filters.q}”`, remove: { q: "" } }] : []),
  ...filters.regions.map((slug) => ({
    key: `region-${slug}`,
    label: regions.find((region) => region.slug === slug)?.name ?? slug,
    remove: { regions: filters.regions.filter((value) => value !== slug) },
  })),
  ...filters.lengths.map((value) => ({
    key: `length-${value}`,
    label: labelOf(TREK_LENGTHS, value),
    remove: { lengths: filters.lengths.filter((existing) => existing !== value) },
  })),
  ...filters.difficulties.map((value) => ({
    key: `difficulty-${value}`,
    label: DIFFICULTIES.find((level) => level.value === value)?.label ?? value,
    remove: { difficulties: filters.difficulties.filter((existing) => existing !== value) },
  })),
  ...filters.seasons.map((value) => ({
    key: `season-${value}`,
    label: labelOf(TREK_SEASONS, value),
    remove: { seasons: filters.seasons.filter((existing) => existing !== value) },
  })),
];

type ActiveFilterChipsProps = FilterActions & { filters: TrekFilters; regions: readonly RegionOption[] };

export const ActiveFilterChips = ({ filters, regions, update, clearAll }: ActiveFilterChipsProps) => {
  const chips = buildChips(filters, regions);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => update(chip.remove)}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-brand/20 bg-brand-tint py-1 pr-2 pl-3 text-caption font-semibold text-navy hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {chip.label}
          <Icon name="close" size={16} className="text-brand" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="cursor-pointer rounded-sm px-1 text-caption font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        Clear all
      </button>
    </div>
  );
};

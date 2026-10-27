"use client";

import type { ReactNode } from "react";

import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { PillCheckboxGroup } from "@/components/ui/PillCheckboxGroup";

import { DIFFICULTIES } from "../../difficulty";
import { TREK_LENGTHS } from "../../filters";
import { countForOption, toggleValue } from "../../filtering";
import type { TrekFilters } from "../../filtering";
import type { TrekSummary } from "../../types";
import type { FilterActions, RegionOption } from "./types";

type FilterSectionsProps = Pick<FilterActions, "update"> & {
  filters: TrekFilters;
  treks: readonly TrekSummary[];
  regions: readonly RegionOption[];
};

const Section = ({ children }: { children: ReactNode }) => (
  <div className="border-b border-muted px-4.5 py-4 last:border-b-0">{children}</div>
);

/** The filter controls themselves: region, length, difficulty and dates. */
export const FilterSections = ({ filters, treks, regions, update }: FilterSectionsProps) => (
  <>
    <Section>
      <CheckboxGroup
        legend="Region"
        options={regions.map((region) => ({
          value: region.slug,
          label: region.name,
          count: countForOption(treks, filters, "regions", region.slug),
        }))}
        selected={filters.regions}
        onToggle={(slug) => update({ regions: toggleValue(filters.regions, slug) })}
      />
    </Section>
    <Section>
      <PillCheckboxGroup
        legend="Trek length"
        options={TREK_LENGTHS}
        selected={filters.lengths}
        onToggle={(value) => update({ lengths: toggleValue(filters.lengths, value) })}
      />
    </Section>
    <Section>
      <CheckboxGroup
        legend="Difficulty"
        options={DIFFICULTIES.map((level) => ({
          value: level.value,
          label: level.label,
          dotClassName: level.dot,
          count: countForOption(treks, filters, "difficulties", level.value),
        }))}
        selected={filters.difficulties}
        onToggle={(value) => update({ difficulties: toggleValue(filters.difficulties, value) })}
      />
    </Section>
  </>
);

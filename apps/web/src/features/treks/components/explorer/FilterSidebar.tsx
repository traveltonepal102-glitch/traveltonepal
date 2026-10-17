"use client";

import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { PillCheckboxGroup } from "@/components/ui/PillCheckboxGroup";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { DIFFICULTIES } from "../../difficulty";
import { TREK_LENGTHS } from "../../filters";
import { countForOption, toggleValue } from "../../filtering";
import type { TrekFilters } from "../../filtering";
import type { TrekSummary } from "../../types";
import type { FilterActions, RegionOption } from "./types";

type FilterSidebarProps = FilterActions & {
  id: string;
  filters: TrekFilters;
  treks: readonly TrekSummary[];
  regions: readonly RegionOption[];
  shownCount: number;
  /** Phones and tablets: the sidebar opens over the results instead of sitting beside them. */
  isOpen: boolean;
  onClose: () => void;
  footer: ReactNode;
};

const Section = ({ children }: { children: ReactNode }) => (
  <div className="border-b border-muted px-4.5 py-4 last:border-b-0">{children}</div>
);

export const FilterSidebar = (props: FilterSidebarProps) => {
  const { id, filters, treks, regions, shownCount, isOpen, onClose, footer, update, clearAll } = props;

  return (
    <aside id={id} aria-label="Filters" className={`lg:sticky lg:top-4 ${isOpen ? "" : "max-lg:hidden"}`}>
      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-line px-4.5 py-4">
          <h2 className="inline-flex items-center gap-2 text-h4">
            <Icon name="tune" className="text-brand" />
            Filters
          </h2>
          <button type="button" onClick={clearAll} className="cursor-pointer rounded-sm text-caption font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            Clear all
          </button>
        </div>

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
        <Section>
          <p className="mb-2.5 text-label tracking-wider text-muted-foreground uppercase">Dates</p>
          <ToggleSwitch
            label="Has fixed departure dates"
            isOn={filters.fixedDatesOnly}
            onChange={(isOn) => update({ fixedDatesOnly: isOn })}
          />
          <p className="mt-2.5 text-xs text-muted-foreground">Every trek can also start on your own dates.</p>
        </Section>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-3.5 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-md bg-brand font-bold text-on-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
      >
        Show {shownCount} {shownCount === 1 ? "trek" : "treks"}
      </button>
      <div className="mt-3.5 max-lg:hidden">{footer}</div>
    </aside>
  );
};

import { Icon } from "@ttn/ui/icon";

import type { GuideFilters } from "../../guideFiltering";
import type { RegionOption } from "../../guideLists";
import { getGuideTopic } from "../../topics";

type Chip = { key: string; label: string; remove: () => void };

type GuideActiveFiltersProps = {
  filters: GuideFilters;
  regions: readonly RegionOption[];
  /** Guides matching every filter. */
  total: number;
  clearSearch: () => void;
  setRegion: (region: string | null) => void;
  setTopic: (topic: null) => void;
  clearAll: () => void;
};

/** The chosen search, region and topic as removable chips, with the number of guides and "Clear all" (as on the Treks page). */
export const GuideActiveFilters = ({ filters, regions, total, clearSearch, setRegion, setTopic, clearAll }: GuideActiveFiltersProps) => {
  const chips: Chip[] = [
    ...(filters.q ? [{ key: "q", label: `Search: “${filters.q}”`, remove: clearSearch }] : []),
    ...(filters.region
      ? [{ key: "region", label: regions.find((region) => region.slug === filters.region)?.name ?? filters.region, remove: () => setRegion(null) }]
      : []),
    ...(filters.topic ? [{ key: "topic", label: getGuideTopic(filters.topic).title, remove: () => setTopic(null) }] : []),
  ];
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption font-normal text-muted-foreground">
        {total} {total === 1 ? "guide" : "guides"} for
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
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

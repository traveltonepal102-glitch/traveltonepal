"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { inputClass } from "@/components/ui/formStyles";

import { MONTH_RATING_LABELS } from "../../constants";
import type { RegionCardItem } from "../../lib/regionCard";
import { RegionCard } from "./RegionCard";

type RegionGridProps = {
  regions: RegionCardItem[];
};

const LEGEND = [
  { label: MONTH_RATING_LABELS.best, className: "bg-month-best" },
  { label: MONTH_RATING_LABELS.possible, className: "bg-month-possible" },
  { label: MONTH_RATING_LABELS.avoid, className: "bg-month-avoid" },
];

/** Search box, month legend and the region cards. Filters in the page (a handful of regions). */
export const RegionGrid = ({ regions }: RegionGridProps) => {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const shown = search ? regions.filter((region) => `${region.name} ${region.district}`.toLowerCase().includes(search)) : regions;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative block max-w-90 min-w-55 flex-1">
          <span className="sr-only">Search regions</span>
          <Icon name="search" className="pointer-events-none absolute top-2.75 left-3 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search regions"
            className={cn(inputClass, "pl-10.5")}
          />
        </label>
        <span className="flex-1" />
        <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
          {LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              <span className={cn("size-2.5 rounded-[3px]", item.className)} />
              {item.label}
            </span>
          ))}
        </span>
      </div>

      {shown.length ? (
        <ul className="m-0 grid list-none gap-4 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
          {shown.map((region) => (
            <li key={region.id}>
              <RegionCard region={region} />
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground">
          No region matches “{query.trim()}”.
        </p>
      )}
    </>
  );
};

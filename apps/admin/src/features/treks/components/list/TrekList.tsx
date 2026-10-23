"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { inputClass } from "@/components/ui/formStyles";

import type { TrekListItem, TrekSort, TrekStatusFilter } from "../../lib/trekListItem";
import { filterTreks } from "../../lib/trekListItem";
import type { RegionOption } from "../../types";
import { TrekTable } from "./TrekTable";

type TrekListProps = {
  treks: TrekListItem[];
  regions: RegionOption[];
};

const SORT_OPTIONS: { value: TrekSort; label: string }[] = [
  { value: "edited", label: "Recently edited" },
  { value: "name", label: "Name A–Z" },
  { value: "price", label: "Price, low to high" },
];

const isSort = (value: string): value is TrekSort => SORT_OPTIONS.some((option) => option.value === value);

/** Status pills, search, region and sort, then the table. Filters in the page (a few dozen treks at most). */
export const TrekList = ({ treks, regions }: TrekListProps) => {
  const [status, setStatus] = useState<TrekStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [regionId, setRegionId] = useState("");
  const [sort, setSort] = useState<TrekSort>("edited");

  const shown = filterTreks(treks, { search, regionId, status, sort });
  const publishedCount = treks.filter((trek) => trek.status === "published").length;
  const pills: { value: TrekStatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All treks", count: treks.length },
    { value: "published", label: "Published", count: publishedCount },
    { value: "unpublished", label: "Drafts and hidden", count: treks.length - publishedCount },
  ];

  return (
    <>
      <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill.value}
            type="button"
            aria-pressed={status === pill.value}
            onClick={() => setStatus(pill.value)}
            className="m-0 inline-flex min-h-8.5 cursor-pointer items-center gap-2 rounded-full border border-solid border-line-strong bg-surface px-3.5 font-sans text-caption font-bold text-text hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white"
          >
            {pill.label}
            <span className="rounded-full bg-black/8 px-1.5 text-xs">{pill.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative block max-w-90 min-w-55 flex-1">
          <span className="sr-only">Search treks</span>
          <Icon name="search" className="pointer-events-none absolute top-2.75 left-3 text-muted-foreground" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search treks" className={cn(inputClass, "pl-10.5")} />
        </label>
        <label>
          <span className="sr-only">Region</span>
          <select value={regionId} onChange={(event) => setRegionId(event.target.value)} className={cn(inputClass, "w-auto cursor-pointer pr-8")}>
            <option value="">All regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort</span>
          <select value={sort} onChange={(event) => isSort(event.target.value) && setSort(event.target.value)} className={cn(inputClass, "w-auto cursor-pointer pr-8")}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <span className="flex-1" />
        <span role="status" className="text-caption text-muted-foreground">
          Showing {shown.length} of {treks.length}
        </span>
      </div>

      {shown.length ? (
        <TrekTable treks={shown} />
      ) : (
        <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground">
          No trek matches these filters.
        </p>
      )}
    </>
  );
};

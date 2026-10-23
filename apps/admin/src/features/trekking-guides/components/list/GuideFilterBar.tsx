"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { inputClass } from "@/components/ui/formStyles";

import type { GuideFilters } from "../../lib/guideRules";

type GuideFilterBarProps = {
  filters: GuideFilters;
  onChange: (filters: GuideFilters) => void;
  regions: { id: string; name: string }[];
  languages: string[];
  /** e.g. "8 trekking guides" or "2 of 8 guides". */
  countLabel: string;
};

/** Search by name, and filter by region and language (design: the toolbar above the cards). */
export const GuideFilterBar = ({ filters, onChange, regions, languages, countLabel }: GuideFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2.5 max-tablet:flex-col max-tablet:items-stretch">
    <label className="relative block min-w-55 flex-1 tablet:max-w-90">
      <span className="sr-only">Search guides</span>
      <Icon name="search" size={20} className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground" />
      <input
        type="search"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search guides by name"
        className={cn(inputClass, "pl-10.5")}
      />
    </label>
    <select aria-label="Filter by region" value={filters.regionId} onChange={(event) => onChange({ ...filters, regionId: event.target.value })} className={cn(inputClass, "w-auto min-w-42 cursor-pointer pr-8")}>
      <option value="">All regions</option>
      {regions.map((region) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      ))}
    </select>
    <select aria-label="Filter by language" value={filters.language} onChange={(event) => onChange({ ...filters, language: event.target.value })} className={cn(inputClass, "w-auto min-w-40 cursor-pointer pr-8")}>
      <option value="">Any language</option>
      {languages.map((language) => (
        <option key={language} value={language}>
          Speaks {language}
        </option>
      ))}
    </select>
    <span className="flex-1 max-tablet:hidden" />
    <span role="status" className="text-xs text-muted-foreground">
      {countLabel}
    </span>
  </div>
);

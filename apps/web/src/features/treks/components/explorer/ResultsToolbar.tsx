"use client";

import { Icon } from "@ttn/ui/icon";

import { TREK_SORTS } from "../../filters";
import type { TrekSort } from "../../filters";

type ResultsToolbarProps = {
  shownCount: number;
  activeCount: number;
  sort: TrekSort;
  onSortChange: (sort: TrekSort) => void;
  sidebarId: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const isTrekSort = (value: string): value is TrekSort => TREK_SORTS.some((option) => option.value === value);

/** Result count, the Filters button (phones and tablets) and the sort menu. */
export const ResultsToolbar = (props: ResultsToolbarProps) => {
  const { shownCount, activeCount, sort, onSortChange, sidebarId, isSidebarOpen, onToggleSidebar } = props;

  return (
    <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-expanded={isSidebarOpen}
          aria-controls={sidebarId}
          onClick={onToggleSidebar}
          className="inline-flex min-h-10.5 cursor-pointer items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3.5 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
        >
          <Icon name="tune" size={18} className="text-brand" />
          {activeCount ? `Filters (${activeCount})` : "Filters"}
        </button>
        <p aria-live="polite" className="text-body text-text">
          <strong className="font-display text-h4 text-ink">{shownCount}</strong>{" "}
          {shownCount === 1 ? "trek found" : "treks found"}
        </p>
      </div>
      <label className="inline-flex items-center gap-2 text-caption font-normal text-muted-foreground">
        Sort by
        {/* 16px text: smaller makes iPhones zoom in when the menu is tapped. */}
        <select
          value={sort}
          onChange={(event) => isTrekSort(event.target.value) && onSortChange(event.target.value)}
          className="min-h-10 cursor-pointer rounded-md border border-line-strong bg-surface px-2.5 text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-md:flex-1"
        >
          {TREK_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

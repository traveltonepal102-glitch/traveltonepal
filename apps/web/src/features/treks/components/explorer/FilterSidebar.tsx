"use client";

import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { useFilterSheet } from "../../hooks/useFilterSheet";
import type { TrekFilters } from "../../filtering";
import type { TrekSummary } from "../../types";
import { FilterSections } from "./FilterSections";
import { FilterSheetFooter } from "./FilterSheetFooter";
import type { FilterActions, RegionOption } from "./types";

type FilterSidebarProps = FilterActions & {
  id: string;
  filters: TrekFilters;
  treks: readonly TrekSummary[];
  regions: readonly RegionOption[];
  shownCount: number;
  /** Phones and tablets: the filters open as a bottom sheet over the results. */
  isOpen: boolean;
  onClose: () => void;
  footer: ReactNode;
};

/** Desktop: a sticky sidebar. Below `lg`: a bottom sheet that slides up over a backdrop. */
const SIDE =
  "lg:sticky lg:top-4 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-60 max-lg:max-h-[86dvh] max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:rounded-t-[22px] max-lg:bg-surface max-lg:shadow-[0_-18px_40px_-12px_rgba(0,40,74,0.35)]";
// Shown at once (so focus can move in) and hidden only after the slide-down ends.
const SHEET_OPEN = "max-lg:motion-safe:[transition:translate_280ms_cubic-bezier(.2,.8,.2,1),visibility_0s]";
const SHEET_CLOSED =
  "max-lg:invisible max-lg:translate-y-[105%] max-lg:motion-safe:[transition:translate_280ms_cubic-bezier(.2,.8,.2,1),visibility_0s_linear_280ms]";

export const FilterSidebar = (props: FilterSidebarProps) => {
  const { id, filters, treks, regions, shownCount, isOpen, onClose, footer, update, clearAll } = props;
  const { sheetRef, initialFocusRef } = useFilterSheet(isOpen, onClose);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-navy/50 motion-safe:transition-[opacity,visibility] motion-safe:duration-280 lg:hidden ${isOpen ? "" : "invisible opacity-0"}`}
      />
      <aside
        ref={sheetRef}
        id={id}
        aria-label="Filters"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen || undefined}
        className={`${SIDE} ${isOpen ? SHEET_OPEN : SHEET_CLOSED}`}
      >
        <div aria-hidden="true" className="sticky top-0 z-10 flex justify-center bg-surface pt-2.5 pb-1 lg:hidden">
          <span className="h-1.25 w-11 rounded-full bg-line-strong" />
        </div>

        <div className="overflow-hidden bg-surface lg:rounded-lg lg:border lg:border-line lg:shadow-card">
          <div className="flex items-center justify-between border-b border-line px-4.5 py-4">
            <h2 className="inline-flex items-center gap-2 text-h4">
              <Icon name="tune" className="text-brand" />
              Filters
            </h2>
            <div className="flex items-center gap-3.5">
              <button type="button" onClick={clearAll} className="cursor-pointer rounded-sm text-caption font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring">
                Clear all
              </button>
              <button
                ref={initialFocusRef}
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-muted text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
          </div>

          <FilterSections filters={filters} treks={treks} regions={regions} update={update} />
        </div>

        <FilterSheetFooter shownCount={shownCount} onClearAll={clearAll} onClose={onClose} />
        <div className="mt-3.5 max-lg:hidden">{footer}</div>
      </aside>
    </>
  );
};

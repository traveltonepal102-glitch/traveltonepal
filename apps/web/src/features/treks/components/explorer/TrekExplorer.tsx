"use client";

import { useState } from "react";

import { useTrekFilters } from "../../hooks/useTrekFilters";
import { EMPTY_TREK_FILTERS, activeFilterCount, filterAndSortTreks } from "../../filtering";
import type { TrekFilters } from "../../filtering";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { FilterSidebar } from "./FilterSidebar";
import { NoResults } from "./NoResults";
import { ResultsToolbar } from "./ResultsToolbar";
import { ShortcutBar } from "./ShortcutBar";
import type { FilterActions, TrekExplorerData } from "./types";

const SIDEBAR_ID = "trek-filters";

type TrekExplorerViewProps = TrekExplorerData & FilterActions & { filters: TrekFilters };

/** Shortcuts, filter sidebar and results. Pure view: filters come in, changes go out. */
const TrekExplorerView = (props: TrekExplorerViewProps) => {
  const { treks, regions, cards, sidebarFooter, resultsFooter, filters, update, clearAll } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const shown = filterAndSortTreks(treks, filters);

  return (
    <>
      <ShortcutBar active={filters.shortcut} onPick={(shortcut) => update({ shortcut })} />

      <section aria-label="Treks" className="pt-7 pb-12">
        <div className="mx-auto max-w-content gap-7 px-4 md:px-6 lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:items-start">
          <FilterSidebar
            id={SIDEBAR_ID}
            filters={filters}
            treks={treks}
            regions={regions}
            shownCount={shown.length}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            footer={sidebarFooter}
            update={update}
            clearAll={clearAll}
          />

          <div className="flex min-w-0 flex-col gap-4 max-lg:mt-4">
            <ResultsToolbar
              shownCount={shown.length}
              activeCount={activeFilterCount(filters)}
              sort={filters.sort}
              onSortChange={(sort) => update({ sort })}
              sidebarId={SIDEBAR_ID}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
            />
            <ActiveFilterChips filters={filters} regions={regions} update={update} clearAll={clearAll} />

            {shown.length > 0 ? (
              <ul className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-3">
                {shown.map((trek) => (
                  <li key={trek.slug}>{cards[trek.slug]}</li>
                ))}
              </ul>
            ) : (
              <NoResults onClearAll={clearAll} />
            )}
            <div className="mt-2">{resultsFooter}</div>
          </div>
        </div>
      </section>
    </>
  );
};

/** The live explorer: filters read from and written to the URL. */
export const TrekExplorer = (data: TrekExplorerData) => {
  const { filters, update, clearAll } = useTrekFilters(data.regions.map((region) => region.slug));
  return <TrekExplorerView {...data} filters={filters} update={update} clearAll={clearAll} />;
};

const doNothing = () => {};

/**
 * Pre-rendered version (no URL yet): every trek, no filters. It is the Suspense fallback, so the
 * page's static HTML lists all treks for search engines and first paint; the live explorer replaces it.
 */
export const TrekExplorerStatic = (data: TrekExplorerData) => (
  <TrekExplorerView {...data} filters={EMPTY_TREK_FILTERS} update={doNothing} clearAll={doNothing} />
);

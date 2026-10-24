"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { SWIPE_ITEM, SWIPE_ROW, SWIPE_ROW_RESET } from "./swipeRow";

export type TrekFilterOption = { key: string; label: string };

export type FilterableTrek = {
  slug: string;
  /** Keys of the filters this trek matches (worked out on the server). */
  filterKeys: readonly string[];
  /** The trek card, rendered on the server. */
  card: ReactNode;
};

type TrekFilterListProps = {
  /** Eyebrow and heading, shown left of the filter chips. */
  heading: ReactNode;
  filters: readonly TrekFilterOption[];
  allKey: string;
  treks: readonly FilterableTrek[];
  /** Phones only: the last card in the swipe row. */
  endCard: ReactNode;
};

/**
 * Filter chips over the trek cards. Every card stays in the HTML (hidden when filtered out) so all
 * links are crawlable; nothing is fetched in the browser.
 */
export const TrekFilterList = ({ heading, filters, allKey, treks, endCard }: TrekFilterListProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [activeKey, setActiveKey] = useState(allKey);
  const isShown = (trek: FilterableTrek) => activeKey === allKey || trek.filterKeys.includes(activeKey);
  const shownCount = treks.filter(isShown).length;

  const selectFilter = (key: string) => {
    setActiveKey(key);
    listRef.current?.scrollTo({ left: 0 }); // phones: back to the first card
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4.5">
        {heading}
        {/* No filters: no chip row. Phones: the chips scroll sideways edge to edge, so the row is the full width plus both gutters. */}
        {filters.length > 0 && (
          <div
            role="group"
            aria-label="Filter treks"
            className={`flex gap-2 pb-0.5 max-md:w-[calc(100%+2rem)] ${SWIPE_ROW} ${SWIPE_ROW_RESET}`}
          >
            {filters.map((filter) => {
              const isActive = filter.key === activeKey;
              return (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectFilter(filter.key)}
                  className={`min-h-11 flex-none cursor-pointer rounded-full px-4.5 text-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    isActive ? "bg-ink font-bold text-white" : "border-[1.5px] border-line-strong bg-surface font-semibold text-ink hover:border-brand"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {shownCount} {shownCount === 1 ? "trek" : "treks"}
      </p>

      <ul
        ref={listRef}
        aria-label="Popular treks"
        className={`gap-3.5 pt-1 pb-3.5 md:grid md:grid-cols-2 md:gap-5 md:p-0 lg:grid-cols-3 ${SWIPE_ROW} ${SWIPE_ROW_RESET}`}
      >
        {treks.map((trek) => (
          <li key={trek.slug} hidden={!isShown(trek)} className={SWIPE_ITEM}>
            {trek.card}
          </li>
        ))}
        {shownCount === 0 && (
          <li className={`rounded-xl bg-surface p-6 text-center md:col-span-full ${SWIPE_ITEM}`}>
            No popular treks match this filter yet. See all treks for more.
          </li>
        )}
        <li className={`md:hidden ${SWIPE_ITEM}`}>{endCard}</li>
      </ul>
    </>
  );
};

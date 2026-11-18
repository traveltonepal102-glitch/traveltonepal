"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef, useState } from "react";

type TabsProps = {
  /** What the tabs choose between, for screen readers ("Packliste"). */
  label: string;
  tabs: readonly { title: string; note?: string }[];
  /** One panel per tab, rendered on the server: all are in the page (only hidden), so search engines read every one. */
  panels: readonly ReactNode[];
  /** The tabs as a column beside the panel from lg (a row that scrolls sideways below it); a row of round tabs otherwise. */
  isVertical?: boolean;
};

const KEYS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const ROUND_TAB = "inline-flex min-h-11.5 items-center gap-1.5 rounded-full border-[1.5px] border-solid px-4.5";
const ROUND_ACTIVE = "border-ocean bg-ocean text-snow";
const ROUND_IDLE = "border-line bg-snow text-ink hover:border-ocean";
const SIDE_TAB = "flex min-h-13 flex-none items-center justify-between gap-3 rounded-2xl border-[1.5px] border-solid px-4 py-2.5 text-left leading-5 max-lg:min-h-11.5 max-lg:rounded-full max-lg:py-0 lg:whitespace-normal";
const SIDE_ACTIVE = "border-ocean bg-ocean text-snow";
const SIDE_IDLE = "border-transparent bg-transparent text-ink hover:bg-snow max-lg:border-line max-lg:bg-snow";

/** Tabs over or beside their panels (design: the packing list): arrow keys move between tabs, as screen-reader users expect. */
export const Tabs = ({ label, tabs, panels, isVertical = false }: TabsProps) => {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = KEYS[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={isVertical ? "grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8" : "flex flex-col gap-5"}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        className={isVertical ? "flex gap-2 max-lg:-mx-(--gutter) max-lg:overflow-x-auto max-lg:px-(--gutter) max-lg:[scrollbar-width:none] lg:sticky lg:top-28 lg:flex-col lg:gap-1" : "flex flex-wrap gap-2"}
      >
        {tabs.map((tab, index) => {
          const isActive = index === active;
          const look = isVertical ? `${SIDE_TAB} ${isActive ? SIDE_ACTIVE : SIDE_IDLE}` : `${ROUND_TAB} ${isActive ? ROUND_ACTIVE : ROUND_IDLE}`;
          return (
            <button
              key={tab.title}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={isActive}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={`cursor-pointer font-[inherit] text-[15px] font-semibold whitespace-nowrap ${look}`}
            >
              {isVertical ? <span className="min-w-0">{tab.title}</span> : tab.title}
              {tab.note && (
                <span className={`inline-flex min-w-7 flex-none items-center justify-center rounded-full px-2 text-xs leading-5 font-bold ${isActive ? "bg-white/20 text-snow" : "bg-ice text-muted"}`}>{tab.note}</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="min-w-0">
        {panels.map((panel, index) => (
          <div key={tabs[index]?.title ?? index} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={index !== active}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
};

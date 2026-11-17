"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef, useState } from "react";

type TabsProps = {
  /** What the tabs choose between, for screen readers ("Packing list", "Question topics"). */
  label: string;
  tabs: readonly { title: string; note?: string }[];
  /** One panel per tab, rendered on the server: all are in the page (only hidden), so search engines read every one. */
  panels: readonly ReactNode[];
};

/** Round tabs over panels (design: the packing list and the questions): arrow keys move between tabs, as screen-reader users expect. */
export const Tabs = ({ label, tabs, panels }: TabsProps) => {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => {
          const isActive = index === active;
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
              className={`inline-flex min-h-11.5 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-solid px-4.5 font-[inherit] text-[15px] font-semibold ${isActive ? "border-maroon bg-maroon text-snow" : "border-line bg-snow text-ink hover:border-maroon"}`}
            >
              {tab.title}
              {tab.note && <span className="opacity-65">{tab.note}</span>}
            </button>
          );
        })}
      </div>
      {panels.map((panel, index) => (
        <div key={tabs[index]?.title ?? index} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={index !== active}>
          {panel}
        </div>
      ))}
    </div>
  );
};

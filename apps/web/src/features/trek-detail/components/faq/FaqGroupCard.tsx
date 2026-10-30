"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";
import type { ReactNode } from "react";

import type { FaqGroup } from "../../types";

type FaqGroupCardProps = {
  group: FaqGroup;
  /** Anchor of the group, linked from the topic list. */
  id: string;
  /** Opens the first question when the page loads (the first group only). */
  isFirstOpen?: boolean;
  /** Each answer as written in the admin (photos where they were put), drawn on the server, in the questions' order. */
  answers: readonly ReactNode[];
};

/**
 * One FAQ topic. Each answer is a native <details>, so it works without JavaScript and every answer is
 * in the HTML for search engines; "Expand all" opens or closes the whole topic.
 */
export const FaqGroupCard = ({ group, id, isFirstOpen = false, answers }: FaqGroupCardProps) => {
  const [openItems, setOpenItems] = useState<ReadonlySet<number>>(() => new Set(isFirstOpen ? [0] : []));
  const isAllOpen = openItems.size === group.items.length;

  const setItemOpen = (index: number, isOpen: boolean) =>
    setOpenItems((current) => {
      if (current.has(index) === isOpen) return current;
      const next = new Set(current);
      if (isOpen) next.add(index);
      else next.delete(index);
      return next;
    });

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between gap-2.5 border-b border-muted px-4.5 py-4.5 md:px-6">
        <h3 id={`${id}-title`} className="text-[19px] leading-snug font-extrabold">
          {group.title}
        </h3>
        <button
          type="button"
          onClick={() => setOpenItems(isAllOpen ? new Set() : new Set(group.items.map((_, index) => index)))}
          className="flex-none cursor-pointer rounded-full border border-chart-3 bg-[#f4f8fc] px-4 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {isAllOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      {group.items.map((item, index) => (
        <details
          key={item.question}
          open={openItems.has(index)}
          onToggle={(event) => setItemOpen(index, event.currentTarget.open)}
          className="group border-t border-muted first-of-type:border-t-0"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4.5 py-4.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring md:px-6 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[15px] font-bold text-ink">{item.question}</span>
            <span
              aria-hidden="true"
              className="inline-flex size-7 flex-none items-center justify-center rounded-full border border-line text-subtle transition-transform group-open:rotate-180 group-open:border-brand/20 group-open:text-brand"
            >
              <Icon name="keyboard_arrow_down" size={18} />
            </span>
          </summary>
          <div className="flex flex-col gap-3 border-t border-muted bg-[#fbfcfe] px-4.5 pt-1 pb-5 text-body-sm text-text md:px-6">
            {answers[index]}
          </div>
        </details>
      ))}
    </section>
  );
};

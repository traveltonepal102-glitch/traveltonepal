"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeFaqGroup } from "../types";

type FaqGroupCardProps = {
  group: HomeFaqGroup;
  /** The topic's anchor, linked from the topic list. */
  id: string;
  /** Opens the first question when the page loads (the first topic only). */
  isFirstOpen?: boolean;
  /** Each answer as written in the admin, drawn on the server, in the questions' order. */
  answers: readonly ReactNode[];
};

/**
 * One topic of the questions (after Travel To Nepal's FAQ): its title and "Alle öffnen" ("Expand all"), then each question as a native
 * <details>, so it works without JavaScript and every answer is in the page for search engines.
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
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 overflow-hidden rounded-[20px] border border-solid border-line bg-snow shadow-card">
      <div className="flex items-center justify-between gap-3 border-0 border-b border-solid border-line px-6 py-4.5 max-sm:px-4.5">
        <h3 id={`${id}-h`} className="flex items-center gap-3 text-[20px]! leading-6.5!">
          <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-xl bg-ice text-ocean">
            <TrailIcon name={group.icon} size={18} />
          </span>
          {group.title}
        </h3>
        <button
          type="button"
          onClick={() => setOpenItems(isAllOpen ? new Set() : new Set(group.items.map((_, index) => index)))}
          className="flex-none cursor-pointer rounded-full border border-solid border-line bg-mist px-4 py-1.5 font-[inherit] text-[13px] font-semibold text-ocean hover:border-ocean"
        >
          {isAllOpen ? "Alle schließen" : "Alle öffnen"}
        </button>
      </div>
      {group.items.map((item, index) => (
        <details
          key={item.question}
          open={openItems.has(index)}
          onToggle={(event) => setItemOpen(index, event.currentTarget.open)}
          className="group border-0 border-t border-solid border-line first-of-type:border-t-0"
        >
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 focus-visible:-outline-offset-3 max-sm:px-4.5 [&::-webkit-details-marker]:hidden">
            <span className="text-[17px] leading-6 font-semibold text-ink">{item.question}</span>
            <span aria-hidden="true" className="inline-flex size-8 flex-none items-center justify-center rounded-full border border-solid border-line text-muted transition-transform group-open:rotate-180 group-open:border-ocean/30 group-open:text-ocean">
              <TrailIcon name="chevron" size={16} />
            </span>
          </summary>
          <div className="flex flex-col gap-3 border-0 border-t border-solid border-line bg-mist px-6 pt-4 pb-5 text-base leading-6.5 max-sm:px-4.5">{answers[index]}</div>
        </details>
      ))}
    </section>
  );
};

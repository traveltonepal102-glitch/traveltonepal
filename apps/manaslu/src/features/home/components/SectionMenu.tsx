"use client";

import { useEffect, useRef } from "react";

import { formatUsd } from "@/lib/format";

import type { HomeSectionKey } from "../types";
import { useActiveSection } from "./useActiveSection";

const LABELS: Partial<Record<HomeSectionKey, string>> = {
  intro: "Overview",
  itinerary: "Itinerary",
  guides: "Your guide",
  inclusions: "What’s included",
  route_map: "Route map",
  pricing: "Dates and prices",
  packing: "Packing",
  reviews: "Reviews",
  faq: "FAQ",
};

type SectionMenuProps = { sections: readonly HomeSectionKey[]; priceFromUsd: number | null };

/** The menu that stays at the top while the page scrolls: the trek's sections in its own order, the one being read underlined, and the price. */
export const SectionMenu = ({ sections, priceFromUsd }: SectionMenuProps) => {
  const links = sections.filter((section) => LABELS[section]);
  const { active, jumpTo } = useActiveSection(links);
  const nav = useRef<HTMLElement>(null);

  // On a phone the list scrolls sideways: keep the marked link in view, without moving the page.
  useEffect(() => {
    const list = nav.current;
    const link = active ? list?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (list && link) list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2 });
  }, [active]);

  return (
    <section aria-label="This trek's sections and price" className="sticky top-0 z-20 mt-7 border-y border-solid border-line bg-white/97 backdrop-blur-sm">
      <div className="wrap flex items-center justify-between gap-6">
        <nav ref={nav} aria-label="On this page" className="relative min-w-0 scroll-smooth overflow-x-auto motion-reduce:scroll-auto">
          <ul className="flex gap-7 text-[15px] font-semibold whitespace-nowrap">
            {links.map((section) => {
              const isActive = section === active;
              return (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => jumpTo(section)}
                    className={`inline-flex min-h-15 items-center no-underline hover:text-forest focus-visible:-outline-offset-2 ${isActive ? "text-forest shadow-[inset_0_-3px_0_var(--color-forest)]" : "text-muted"}`}
                  >
                    {LABELS[section]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden flex-none items-center gap-3.5 md:flex">
          {priceFromUsd !== null && (
            <span className="text-right text-sm leading-4.5 text-muted">
              From
              <br />
              <strong className="font-display text-xl leading-6 font-[640] text-ink">{formatUsd(priceFromUsd)}</strong>
            </span>
          )}
          <a href="#book" className="inline-flex min-h-11 items-center rounded-[10px] bg-forest px-5 text-[15px] font-semibold text-snow no-underline hover:bg-forest-deep hover:text-snow">
            Check dates
          </a>
        </div>
      </div>
    </section>
  );
};

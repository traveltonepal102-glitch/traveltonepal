import { PageSectionLinks } from "@/components/shared/PageSectionLinks";
import { formatUsd } from "@/lib/format";

import type { HomeSectionKey } from "../types";

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
export const SectionMenu = ({ sections, priceFromUsd }: SectionMenuProps) => (
  <section aria-label="This trek's sections and price" className="sticky top-0 z-20 mt-7 border-y border-solid border-line bg-white/97 backdrop-blur-sm">
    <div className="wrap flex items-center justify-between gap-6">
      <PageSectionLinks links={sections.flatMap((section) => (LABELS[section] ? [{ id: section, label: LABELS[section] }] : []))} />
      {/* Below lg the bar at the bottom of the screen (MobileBookingBar) has the price and the way to book. */}
      <div className="hidden flex-none items-center gap-3.5 lg:flex">
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

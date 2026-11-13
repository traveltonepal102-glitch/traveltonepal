import { PageSectionLinks } from "@/components/shared/PageSectionLinks";
import { ScrollRevealBar } from "@/components/shared/ScrollRevealBar";
import { ctaButton } from "@/components/ui/buttonStyles";

import type { HomeSectionKey } from "../types";
import { SectionMenuPrice } from "./SectionMenuPrice";

const LABELS: Partial<Record<HomeSectionKey, string>> = {
  intro: "Overview",
  itinerary: "Itinerary",
  guides: "Your guide",
  inclusions: "What’s included",
  route_map: "Route map",
  pricing: "Best months",
  packing: "Packing",
  reviews: "Reviews",
  faq: "FAQ",
};

type SectionMenuProps = { sections: readonly HomeSectionKey[] };

/** The menu that appears at the top once the page is scrolled past the top section: the trek's sections in its own order, the one being read underlined in ember, the price and "Check dates". */
export const SectionMenu = ({ sections }: SectionMenuProps) => (
  <ScrollRevealBar>
    <section aria-label="This trek's sections and price" className="border-b border-solid border-line bg-white/97 shadow-card backdrop-blur-sm">
      <div className="wrap flex items-center justify-between gap-6">
        <PageSectionLinks links={sections.flatMap((section) => (LABELS[section] ? [{ id: section, label: LABELS[section] }] : []))} />
        {/* Below lg the bar at the bottom of the screen (MobileBookingBar) has the price and the way to book. */}
        <div className="hidden flex-none items-center gap-3.5 lg:flex">
          <SectionMenuPrice />
          <a href="#book" className={`${ctaButton} min-h-11 px-5 text-[15px]`}>
            Check dates
          </a>
        </div>
      </div>
    </section>
  </ScrollRevealBar>
);

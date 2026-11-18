import { PageSectionLinks } from "@/components/shared/PageSectionLinks";

import type { HomeSectionKey } from "../types";
import { BookingWhatsAppButton } from "./BookingWhatsAppButton";
import { SectionMenuPrice } from "./SectionMenuPrice";

const LABELS: Partial<Record<HomeSectionKey, string>> = {
  intro: "Überblick",
  highlights: "Highlights",
  itinerary: "Reiseverlauf",
  route_map: "Routenkarte",
  inclusions: "Leistungen",
  pricing: "Preise und Reisezeit",
  reviews: "Bewertungen",
  packing: "Packliste",
  field_guide: "Gut zu wissen",
  faq: "Häufige Fragen",
};

type SectionMenuProps = { sections: readonly HomeSectionKey[]; trekName: string; days: number };

/**
 * The menu that stays at the top while the page scrolls (design: the chapter pills): the trek's sections in its own
 * order, the one being read marked, then the live price and "Per WhatsApp buchen" with the group and day chosen.
 */
export const SectionMenu = ({ sections, trekName, days }: SectionMenuProps) => (
  <section aria-label="Abschnitte und Preis dieses Treks" className="sticky top-0 z-20 border-0 border-b border-solid border-line bg-mist/95 backdrop-blur-sm">
    <div className="wrap flex items-center justify-between gap-5">
      <PageSectionLinks links={sections.flatMap((section) => (LABELS[section] ? [{ id: section, label: LABELS[section] }] : []))} />
      {/* Below lg the bar at the bottom of the screen (MobileBookingBar) has the price and the way to book. */}
      <div className="hidden flex-none items-center gap-3.5 border-0 border-l border-solid border-line pl-5 lg:flex">
        <SectionMenuPrice className="text-right" />
        <BookingWhatsAppButton trekName={trekName} days={days} className="min-h-11 px-4.5 text-[15px]" />
      </div>
    </div>
  </section>
);

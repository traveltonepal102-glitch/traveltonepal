import { isFullWidthTrekSection } from "@ttn/config/trekPageSections";
import type { TrekPageSection } from "@ttn/config/trekPageSections";
import type { IconName } from "@ttn/ui/icon";

import type { SharedSectionKey, TrekSectionKey } from "./types";

type PageSectionInfo = {
  /** The section's heading as the page shows it (in general words). */
  label: string;
  icon: IconName;
} & (
  | /** The editor section where its words are typed. */ { editorKey: TrekSectionKey }
  | /** Written once for every trek: this trek only shows or hides it. */ { sharedKey: SharedSectionKey }
);

/** Every section of the trek page with a heading, for "Order of the page sections". */
export const TREK_PAGE_SECTION_INFO: Record<TrekPageSection, PageSectionInfo> = {
  intro: { label: "Introduction", icon: "notes", editorKey: "intro" },
  overview: { label: "Trip overview and key specifications", icon: "table", editorKey: "facts" },
  founder: { label: "Founder’s story", icon: "format_quote", sharedKey: "founder" },
  consultation: { label: "Ask us personally", icon: "chat", sharedKey: "consultation" },
  highlights: { label: "Highlights", icon: "star", editorKey: "highlights" },
  suitability: { label: "Is this trek for you?", icon: "checklist", editorKey: "fit" },
  itinerary: { label: "Day-by-day itinerary", icon: "route", editorKey: "itinerary" },
  guides: { label: "Meet your trek guide", icon: "hiking", editorKey: "guides" },
  inclusions: { label: "What’s covered · What’s not included", icon: "task_alt", editorKey: "inclusions" },
  elevation: { label: "Route and elevation profile", icon: "landscape", editorKey: "route" },
  route_map: { label: "Route map", icon: "map", editorKey: "route" },
  why_book: { label: "Why book your trek with us", icon: "workspace_premium", sharedKey: "why_book" },
  pricing: { label: "Group rates by team size", icon: "payments", editorKey: "pricing" },
  credentials: { label: "Credentials and government licences", icon: "verified", sharedKey: "credentials" },
  reviews: { label: "Trekker reviews", icon: "rate_review", sharedKey: "reviews" },
  differentiators: { label: "What makes this trip different", icon: "compare_arrows", sharedKey: "differentiators" },
  booking_form: { label: "Booking form", icon: "send", sharedKey: "booking_form" },
  packing: { label: "Packing list", icon: "backpack", editorKey: "packing" },
  field_guide: { label: "Trek guide: season, facilities and safety", icon: "auto_stories", editorKey: "know" },
  faq: { label: "Frequently asked questions", icon: "quiz", editorKey: "faq" },
  booking_cta: { label: "Booking box at the end", icon: "campaign", sharedKey: "booking_cta" },
  similar: { label: "Similar trekking options in Nepal", icon: "travel_explore", editorKey: "similar" },
  newsletter: { label: "Newsletter sign-up", icon: "mail", sharedKey: "newsletter" },
};

/** Where a shared section sits in this trek's order, e.g. "After “Route map”". */
export const placeOnPage = (section: TrekPageSection, order: readonly TrekPageSection[]) => {
  const before = order[order.indexOf(section) - 1];
  if (!before) return "First under the photos";
  if (isFullWidthTrekSection(section) && !isFullWidthTrekSection(before)) return "First after the booking card";
  return `After “${TREK_PAGE_SECTION_INFO[before].label}”`;
};

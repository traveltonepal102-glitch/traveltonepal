import type { IconName } from "@ttn/ui/icon";

import { ADMIN_SECTIONS } from "./navigation";

export type NewItemTone = "brand" | "saffron" | "green";

export type NewItem = {
  label: string;
  hint: string;
  icon: IconName;
  tone: NewItemTone;
  /** Where the item leads. Each goes to its section until the "add" screens exist. */
  href: string;
};

/** The top bar's "New" menu (design: Admin-dashboard.dc.html). */
export const NEW_ITEMS: NewItem[] = [
  { label: "Trek", hint: "Itinerary, prices, photos", icon: "hiking", tone: "brand", href: ADMIN_SECTIONS.treks.href },
  {
    label: "Departure date",
    hint: "Shows a date picker on the trek",
    icon: "event",
    tone: "brand",
    href: ADMIN_SECTIONS.departures.href,
  },
  { label: "Travel guide", hint: "Write it yourself", icon: "article", tone: "brand", href: ADMIN_SECTIONS.travelGuides.href },
  {
    label: "Trekking guide or author",
    hint: "Add once, pick from a list anywhere",
    icon: "person",
    tone: "saffron",
    href: ADMIN_SECTIONS.trekkingGuides.href,
  },
  { label: "Upload photos", hint: "Location data is removed", icon: "image", tone: "green", href: ADMIN_SECTIONS.photos.href },
];

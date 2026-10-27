import type { IconName } from "@ttn/ui/icon";

import { NEW_REGION_PATH } from "@/features/regions/constants";
import { NEW_GUIDE_PATH } from "@/features/trekking-guides/constants";
import { NEW_TREK_PATH } from "@/features/treks/constants";
import type { AdminRole } from "@/lib/supabase/database.types";

import { ADMIN_SECTIONS } from "./navigation";

export type NewItemTone = "brand" | "saffron" | "green";

export type NewItem = {
  label: string;
  hint: string;
  icon: IconName;
  tone: NewItemTone;
  /** Where the item leads: the "add" screen where it exists, otherwise its section. */
  href: string;
  /** Only a Super admin can add one (e.g. a region), so only they see it. */
  isSuperAdminOnly?: boolean;
};

/** The top bar's "New" menu (design: Admin-dashboard.dc.html). */
export const NEW_ITEMS: NewItem[] = [
  { label: "Trek", hint: "Itinerary, prices, photos", icon: "hiking", tone: "brand", href: NEW_TREK_PATH },
  { label: "Region", hint: "Its page, best months and map pin", icon: "map", tone: "brand", href: NEW_REGION_PATH, isSuperAdminOnly: true },
  { label: "Travel guide", hint: "Write it yourself", icon: "article", tone: "brand", href: ADMIN_SECTIONS.travelGuides.href },
  {
    label: "Trekking guide or author",
    hint: "Add once, pick from a list anywhere",
    icon: "person",
    tone: "saffron",
    href: NEW_GUIDE_PATH,
  },
  { label: "Upload photos", hint: "Location data is removed", icon: "image", tone: "green", href: ADMIN_SECTIONS.photos.href },
];

/** The "New" menu for this admin: without what only a Super admin can add, for an editor. */
export const newItemsFor = (role: AdminRole): NewItem[] =>
  role === "super_admin" ? NEW_ITEMS : NEW_ITEMS.filter((item) => !item.isSuperAdminOnly);

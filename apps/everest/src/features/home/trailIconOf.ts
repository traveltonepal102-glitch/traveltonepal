import type { TrailIconName } from "@/components/ui/TrailIcon";

/** The trek editor's icons (Material names, for field guide topics and question groups) drawn with this website's own icons. */
const ICONS: Record<string, TrailIconName> = {
  wb_twilight: "sun",
  wb_sunny: "sun",
  cottage: "home",
  restaurant: "heart",
  soup_kitchen: "heart",
  route: "route",
  nordic_walking: "route",
  map: "map",
  health_and_safety: "shield",
  medical_services: "shield",
  emergency: "shield",
  fitness_center: "trend",
  payments: "tag",
  description: "doc",
  info: "check",
  calendar_month: "calendar",
  event: "calendar",
  backpack: "mountain",
  temple_buddhist: "home",
  groups: "users",
};

/** The website's icon for one of the editor's; a document for any it doesn't know. */
export const trailIconOf = (icon: string | undefined): TrailIconName => ICONS[icon ?? ""] ?? "doc";

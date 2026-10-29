import type { IconName } from "@ttn/ui/icon";

import { formatAltitudeWithFeet, formatDays, formatDistance } from "@/features/treks/format";

import type { TrekDetail } from "./types";

/** Icon circle colors, from the design system's tints. */
export type SpecTone = "brand" | "green" | "navy" | "danger" | "saffron";

export type TrekSpec = {
  icon: IconName;
  tone: SpecTone;
  label: string;
  value: string;
  /** Value printed in green (the guide ratio, a selling point). */
  isHighlighted?: boolean;
};

/** The "Trip overview and key specifications" tiles (twelve when all are known), in design order; blank ones are left out. */
export const trekSpecs = (trek: TrekDetail): TrekSpec[] => {
  const specs: TrekSpec[] = [
  { icon: "location_on", tone: "brand", label: "Start / finish", value: trek.startFinish },
  { icon: "straighten", tone: "brand", label: "Total distance", value: trek.distanceKm ? formatDistance(trek.distanceKm) : "" },
  { icon: "timer", tone: "brand", label: "Daily walking", value: trek.dailyWalking },
  { icon: "groups", tone: "green", label: "Guide to trekker", value: trek.guideRatio, isHighlighted: true },
  { icon: "public", tone: "navy", label: "Country", value: "Nepal" },
  { icon: "calendar_month", tone: "navy", label: "Duration", value: formatDays(trek.days) },
  { icon: "speed", tone: "danger", label: "Difficulty", value: trek.difficulty },
  { icon: "altitude", tone: "navy", label: "Max. altitude", value: formatAltitudeWithFeet(trek.maxAltitudeM) },
  { icon: "wb_sunny", tone: "saffron", label: "Best season", value: trek.seasonLabel },
  { icon: "hotel", tone: "navy", label: "Accommodation", value: trek.accommodation },
  { icon: "route", tone: "navy", label: "Transport", value: trek.transport },
  { icon: "pin_drop", tone: "navy", label: "Activity", value: "Trekking / hiking" },
  ];
  return specs.filter((spec) => spec.value.trim());
};

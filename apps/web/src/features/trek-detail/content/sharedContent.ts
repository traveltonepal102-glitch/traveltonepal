import type { TrekDetailContent } from "../types";

/**
 * "Custom itinerary and private changes": the same offer on every trek (an admin shared section), with the trek's
 * name and its side trip, when it has one.
 */
export const customizationFor = (shortName: string, sideTrip?: string): TrekDetailContent["customization"] => ({
  pitch: `Want to match your own pace, fitness, group or holiday dates? Tell us what you have in mind and our Kathmandu team will change the route as many times as you need, until it is the ${shortName} you want.`,
  options: [
    { label: "Extra rest day", icon: "calendar_month" },
    { label: sideTrip ? `Add ${sideTrip}` : "Add a side trip", icon: "landscape" },
    { label: "Private guide and porter", icon: "groups" },
    { label: "Slower or faster pace", icon: "tune" },
  ],
});

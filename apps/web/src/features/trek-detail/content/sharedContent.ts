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

/** "What makes this trip different": how a local team compares with big agencies (an admin shared section). */
export const differentiatorsFor = (regionName: string): TrekDetailContent["differentiators"] => ({
  intro: `Why trekkers choose our locally led ${regionName} treks.`,
  items: [
    {
      icon: "landscape",
      tone: "saffron",
      title: `Guides who know ${regionName}`,
      text: "Our trek leaders have walked these trails for years and know the teahouse families along the way.",
    },
    {
      icon: "health_and_safety",
      tone: "green",
      title: "Daily health checks",
      text: "Pulse oximeter readings morning and evening help catch altitude sickness early.",
    },
    {
      icon: "nordic_walking",
      tone: "brand",
      title: "Fair porter welfare",
      text: "Fair wages, insurance, warm gear and strict weight limits for every porter.",
    },
    {
      icon: "groups",
      tone: "saffron",
      title: "Small private groups",
      text: "Only your group, with personal pacing and quiet teahouse evenings.",
    },
    {
      icon: "volunteer_activism",
      tone: "navy",
      title: "Money stays local",
      text: "Booking direct with a Nepali company means your money supports families along the trail.",
    },
  ],
});

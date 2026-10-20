import type { IconName } from "@ttn/ui/icon";

import type { IconTone } from "@/components/shared/iconTones";
import { REGIONS } from "@/features/regions/regions";

/**
 * About page copy, from the website design (About.dc.html). [BRACKETED] values wait for the owner's
 * details. Moves to Payload in the CMS phase.
 */

/** Hero stat; the year, region count and rating come from their own data. */
export const TREKKERS_GUIDED = "[N]+";

export type Milestone = { year: string; title: string; text: string; icon: IconName; tone: IconTone };

export const MILESTONES: readonly Milestone[] = [
  {
    year: "[YEAR]",
    title: "Founded in Kathmandu",
    text: "Sujan starts Travel To Nepal with a small team of guides from his home region.",
    icon: "flag",
    tone: "saffron",
  },
  {
    year: "[YEAR]",
    title: "Licensed and registered",
    text: "Registered with the Department of Tourism and a member of TAAN.",
    icon: "verified",
    tone: "green",
  },
  {
    year: "[YEAR]",
    title: "More regions, more guides",
    text: "Treks across [N] regions with guides from each valley.",
    icon: "landscape",
    tone: "brand",
  },
  {
    year: "Today",
    title: `${REGIONS.length} regions, one small team`,
    text: "Every trek planned personally on WhatsApp, from first message to last day.",
    icon: "groups",
    tone: "navy",
  },
];

export type AboutPromise = { icon: IconName; tone: IconTone; title: string; text: string };

/** "What you can expect from us": six promises kept on every trek. */
export const PROMISES: readonly AboutPromise[] = [
  {
    icon: "shield_person",
    tone: "brand",
    title: "Local guides from each valley",
    text: "Licensed guides who grew up in the region they lead and know the teahouse families by name.",
  },
  {
    icon: "price_check",
    tone: "saffron",
    title: "Clear prices, no surprises",
    text: "Everything included is listed before you book. Meals are paid on the trail at real menu prices.",
  },
  {
    icon: "health_and_safety",
    tone: "green",
    title: "Safety on every trek",
    text: "Daily oxygen and pulse checks, a first-aid kit, and rescue coordinated from Kathmandu.",
  },
  {
    icon: "tune",
    tone: "navy",
    title: "Your trek, your dates",
    text: "Every trek is private. Change the pace, days or route; we rewrite the plan for free.",
  },
  {
    icon: "chat",
    tone: "green",
    title: "A real person on WhatsApp",
    text: "You plan with our team directly, before, during and after your trek.",
  },
  {
    icon: "volunteer_activism",
    tone: "saffron",
    title: "Fair to porters and villages",
    text: "Weight limits, warm gear, insurance and fair pay for every person on your team.",
  },
];

export type ResponsiblePractice = { icon: IconName; title: string; points: readonly string[] };

/** "Good for the people and places you visit". */
export const RESPONSIBLE_PRACTICES: readonly ResponsiblePractice[] = [
  { icon: "volunteer_activism", title: "Fair to porters", points: ["Weight limits on every load", "Warm gear and proper boots", "Insurance and fair pay"] },
  { icon: "cottage", title: "Money stays local", points: ["Local guides from each valley", "Family-run teahouses", "Meals bought on the trail"] },
  { icon: "landscape", title: "Leave no trace", points: ["No single-use plastic bottles", "All rubbish carried out", "Stay on marked trails"] },
  {
    icon: "temple_buddhist",
    title: "Respect local culture",
    points: ["Briefing on customs before you go", "Dress well near monasteries", "Ask before taking photos"],
  },
];

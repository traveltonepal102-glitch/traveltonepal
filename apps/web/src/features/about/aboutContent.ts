import type { IconName } from "@ttn/ui/icon";

/** About page copy that rarely changes, from the website design (About.dc.html); the rest is in Pages › About. */

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

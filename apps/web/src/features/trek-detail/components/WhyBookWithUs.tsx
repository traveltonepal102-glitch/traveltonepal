import { TREK_SECTION_IDS } from "../sections";
import type { FeatureItem } from "../types";
import { FeatureGrid } from "./FeatureGrid";
import { SectionHeading } from "./SectionHeading";

/** What booking direct with the local operator gets you; only the guides line names the region. */
const reasonsFor = (region: string): FeatureItem[] => [
  {
    icon: "verified",
    tone: "green",
    title: "Private trek on your dates",
    text: "Every trek runs just for your group, on the start date you choose. No minimum numbers.",
  },
  {
    icon: "landscape",
    tone: "saffron",
    title: "Guides born in the valley",
    text: `Licensed local guides who grew up in ${region}, trained in wilderness first aid.`,
  },
  {
    icon: "price_check",
    tone: "brand",
    title: "Clear prices, no hidden fees",
    text: "Permits, transport, lodging and porters are listed up front. Meals are paid on the trail.",
  },
  {
    icon: "health_and_safety",
    tone: "danger",
    title: "Safety and evacuation plan",
    text: "Daily oxygen and pulse checks, a first-aid kit, and rescue coordinated from Kathmandu.",
  },
  {
    icon: "volunteer_activism",
    tone: "saffron",
    title: "Fair to porters",
    text: "Weight limits, warm gear, insurance and fair pay for every porter on your team.",
  },
  {
    icon: "tune",
    tone: "brand",
    title: "Flexible itinerary",
    text: "Change the pace, add side trips or extra days. No fees for changing your plan.",
  },
];

/** "Direct operator advantage": six reasons to book with the local team rather than an agent. */
export const WhyBookWithUs = ({ region }: { region: string }) => (
  <section id={TREK_SECTION_IDS.why} aria-labelledby="trek-why-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-why-title"
      eyebrow="Direct operator advantage"
      title="Why book your trek with us"
      description="Local leadership, honest pricing and careful safety standards, straight from our Kathmandu team."
    />
    <FeatureGrid items={reasonsFor(region)} />
  </section>
);

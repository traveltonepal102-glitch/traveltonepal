import { getAboutPage } from "@/features/about/services/aboutRepository";

import { TREK_SECTION_IDS } from "../sections";
import { FeatureGrid } from "./FeatureGrid";
import { SectionHeading } from "./SectionHeading";

/**
 * "Direct operator advantage": reasons to book with the local team rather than an agent, the same promises as the
 * About page's "What you can expect from us" (Pages › About). Left out when there are none.
 */
export const WhyBookWithUs = async () => {
  const { promises } = await getAboutPage();
  if (!promises.length) return null;
  return (
  <section id={TREK_SECTION_IDS.why} aria-labelledby="trek-why-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-why-title"
      eyebrow="Direct operator advantage"
      title="Why book your trek with us"
      description="Local leadership, honest pricing and careful safety standards, straight from our Kathmandu team."
    />
    <FeatureGrid items={promises} />
  </section>
  );
};

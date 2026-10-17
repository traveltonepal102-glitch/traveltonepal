import type { TrekDetail } from "../types";
import { FeatureGrid } from "./FeatureGrid";
import { SectionHeading } from "./SectionHeading";

/** "The Travel To Nepal advantage": what sets this trek apart. */
export const TrekDifferentiators = ({ differentiators }: Pick<TrekDetail, "differentiators">) => (
  <section aria-labelledby="trek-different-title" className="flex flex-col gap-4 pt-3">
    <SectionHeading
      id="trek-different-title"
      eyebrow="The Travel To Nepal advantage"
      title="What makes this trip different"
      description={differentiators.intro}
    />
    <FeatureGrid items={differentiators.items} />
  </section>
);

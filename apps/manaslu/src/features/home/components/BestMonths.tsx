import { SectionHeading } from "@/components/shared/SectionHeading";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";

import { MonthTiles } from "./MonthTiles";

/** The twelve months, rated from the regions on the route. */
export const BestMonths = ({ heading, ratings }: { heading: string; ratings: readonly MonthRating[] }) => (
  <section aria-labelledby="months-h" id="months" className="flex flex-col gap-5">
    <SectionHeading id="months-h" eyebrow="When to go" title={heading} />
    <MonthTiles ratings={ratings} />
  </section>
);

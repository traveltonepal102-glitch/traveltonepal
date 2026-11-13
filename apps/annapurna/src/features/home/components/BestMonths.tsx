import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { SectionHeading } from "@/components/shared/SectionHeading";

import { HeadingLine } from "./HeadingLine";
import { MonthTiles } from "./MonthTiles";

type BestMonthsProps = { heading: string; line: RichTextDoc; ratings: readonly MonthRating[] };

/** The twelve months, rated from the regions on the route, under the trek's own line (if any). Stands for the trek's "pricing" section: the booking card beside the page has the prices. */
export const BestMonths = ({ heading, line, ratings }: BestMonthsProps) => (
  <section aria-labelledby="pricing-h" id="pricing" className="flex flex-col gap-5">
    <SectionHeading id="pricing-h" eyebrow="When to go" title={heading}>
      <HeadingLine doc={line} />
    </SectionHeading>
    <MonthTiles ratings={ratings} />
  </section>
);

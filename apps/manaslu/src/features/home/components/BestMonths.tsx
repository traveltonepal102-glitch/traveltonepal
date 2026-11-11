import { SectionHeading } from "@/components/shared/SectionHeading";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { HeadingLine } from "./HeadingLine";
import { MonthTiles } from "./MonthTiles";

type BestMonthsProps = { heading: string; line: RichTextDoc; ratings: readonly MonthRating[] };

/** The twelve months, rated from the regions on the route, under the trek's own line (if any). */
export const BestMonths = ({ heading, line, ratings }: BestMonthsProps) => (
  <section aria-labelledby="months-h" id="months" className="flex flex-col gap-5">
    <SectionHeading id="months-h" eyebrow="When to go" title={heading}>
      <HeadingLine doc={line} />
    </SectionHeading>
    <MonthTiles ratings={ratings} />
  </section>
);

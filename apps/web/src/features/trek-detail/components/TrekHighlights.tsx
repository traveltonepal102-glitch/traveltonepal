import { TREK_SECTION_IDS } from "../sections";
import type { TrekPoint } from "../types";
import { SectionHeading } from "./SectionHeading";
import { PANEL } from "./styles";

type TrekHighlightsProps = {
  heading: string;
  highlights: readonly TrekPoint[];
};

/** "Trek milestones": what makes the trek worth doing, one titled point each. */
export const TrekHighlights = ({ heading, highlights }: TrekHighlightsProps) => (
  <section id={TREK_SECTION_IDS.highlights} aria-labelledby="trek-highlights-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading id="trek-highlights-title" eyebrow="Trek milestones" title={heading} />
    <ul className={`${PANEL} flex flex-col gap-4 p-4.5 md:p-6`}>
      {highlights.map((highlight) => (
        <li key={highlight.title} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 size-2 flex-none rounded-full bg-brand" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[15px] leading-snug font-bold">{highlight.title}</h3>
            <p className="text-caption font-normal text-text">{highlight.text}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

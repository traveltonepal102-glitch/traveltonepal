import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";

/** "Is this trek for you?": a card per point. */
export const TrekSuitability = ({ suitability }: { suitability: HomeTrek["suitability"] }) => (
  <section aria-labelledby="suitability-h" className="flex flex-col gap-5">
    <SectionHeading id="suitability-h" eyebrow="Before you book" title={suitability.heading}>
      {suitability.intro && <p>{suitability.intro}</p>}
    </SectionHeading>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      {suitability.points.map((point) => (
        <div key={point.title} className="flex items-start gap-3.5 rounded-[14px] border border-solid border-line p-5">
          <span className="inline-flex size-11 flex-none items-center justify-center rounded-[10px] bg-forest-tint text-forest">
            <TrailIcon name="check" size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-body! text-[17px]! leading-6! font-semibold">{point.title}</h3>
            <p className="text-[15px] leading-5.75">{point.text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";

/** "Is this trek for you?": one point under another, each with its tick. */
export const TrekSuitability = ({ suitability }: { suitability: HomeTrek["suitability"] }) => (
  <section aria-labelledby="suitability-h" className="flex flex-col gap-5">
    <SectionHeading id="suitability-h" eyebrow="Before you book" title={suitability.heading}>
      {suitability.intro && <p>{suitability.intro}</p>}
    </SectionHeading>
    <ul className="overflow-hidden rounded-[14px] border border-solid border-line">
      {suitability.points.map((point) => (
        <li key={point.title} className="-mt-px flex items-start gap-3.5 border-t border-solid border-line px-5 py-4 max-sm:px-4">
          <span className="mt-0.5 inline-flex size-9 flex-none items-center justify-center rounded-[10px] bg-sky text-navy">
            <TrailIcon name="check" size={20} />
          </span>
          <p className="text-base leading-6.5">
            <strong className="font-semibold text-ink">{point.title}.</strong> {point.text}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

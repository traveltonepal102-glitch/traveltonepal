import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";

/** An icon for each point, in the trek editor's usual order (fitness, altitude, skill, comfort, mind, health). */
const ICONS: readonly TrailIconName[] = ["trend", "mountain", "star", "bed", "heart", "shield"];

/** "Is this trek for you?" (design: Before you book): the trek editor's points as cards, each with its icon. */
export const TrekSuitability = ({ suitability }: { suitability: HomeTrek["suitability"] }) => (
  <section aria-labelledby="suitability-h" className="flex flex-col gap-8">
    <SectionHeading id="suitability-h" eyebrow="Before you book" title={suitability.heading}>
      {suitability.intro && <p className="m-0">{suitability.intro}</p>}
    </SectionHeading>
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 p-0 max-sm:grid-cols-1">
      {suitability.points.map((point, index) => (
        <li key={point.title} className="flex flex-col gap-2.5 rounded-[20px] border border-solid border-line bg-snow p-6">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-cream text-maroon">
              <TrailIcon name={ICONS[index % ICONS.length]} size={20} />
            </span>
            <strong className="text-[19px] leading-6 font-semibold text-ink">{point.title}</strong>
          </span>
          <p className="m-0 text-[15px] leading-6 text-muted">{point.text}</p>
        </li>
      ))}
    </ul>
  </section>
);

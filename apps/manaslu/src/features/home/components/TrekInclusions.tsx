import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";
import { PointList } from "./PointList";
import { TrekMeals } from "./TrekMeals";

type TrekInclusionsProps = Pick<HomeTrek, "inclusions" | "meals">;

/** What the price includes and what it doesn't, side by side, then why meals are extra. */
export const TrekInclusions = ({ inclusions, meals }: TrekInclusionsProps) => (
  <section aria-labelledby="inclusions-h" id="inclusions" className="flex flex-col gap-5">
    <SectionHeading id="inclusions-h" title={inclusions.heading} />
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      {inclusions.included.length > 0 && (
        <div className="flex flex-col gap-3.5 rounded-[14px] border border-solid border-line p-6">
          <h3 className="text-xl! leading-6.5!">Included</h3>
          <PointList points={inclusions.included} icon="check" iconClass="text-forest" />
        </div>
      )}
      {inclusions.excluded.length > 0 && (
        <div className="flex flex-col gap-3.5 rounded-[14px] bg-stone p-6">
          <h3 className="text-xl! leading-6.5!">Not included</h3>
          <PointList points={inclusions.excluded} icon="close" iconClass="text-muted" />
        </div>
      )}
    </div>
    {meals && <TrekMeals meals={meals} />}
  </section>
);

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

import type { HomePoint, HomeTrek } from "../types";
import { TrekMeals } from "./TrekMeals";

type TrekInclusionsProps = Pick<HomeTrek, "inclusions" | "meals">;

/** An icon for an included point by its usual title in the trek editor; a tick for any other. */
const ICONS: Record<string, TrailIconName> = { transport: "route", guide: "users", guides: "users", permits: "doc", accommodation: "bed", lodging: "bed", safety: "shield", meals: "heart" };
const iconOf = (title: string): TrailIconName => ICONS[title.trim().toLowerCase()] ?? "check";

type PointGridProps = { title: string; points: readonly HomePoint[]; isIncluded: boolean };

/**
 * One list as a card (design: what's covered): a header with its mark and count, then the points in a grid as wide as
 * the page allows (three across on a laptop, two on a tablet, one on a phone), the cells parted by hairlines.
 */
const PointGrid = ({ title, points, isIncluded }: PointGridProps) => (
  <div className={`overflow-hidden rounded-3xl border border-solid border-line ${isIncluded ? "bg-snow" : "bg-paper"}`}>
    <h3 className="flex items-center justify-between gap-3 border-0 border-b border-solid border-line px-6 py-4.5 text-[22px]! leading-7! max-sm:px-4.5">
      <span className="flex items-center gap-3">
        <span className={`inline-flex size-8 items-center justify-center rounded-full ${isIncluded ? "bg-whatsapp text-snow" : "bg-cream text-maroon"}`}>
          <TrailIcon name={isIncluded ? "check" : "close"} size={isIncluded ? 18 : 15} />
        </span>
        {title}
      </span>
      <span className="rounded-full bg-cream px-2.5 text-[13px] leading-6 font-semibold text-muted">
        {points.length} {points.length === 1 ? "item" : "items"}
      </span>
    </h3>
    <ul className="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {points.map((point) => (
        <li key={point.title} className="-mr-px -mb-px flex gap-4 border-0 border-r border-b border-solid border-line px-6 py-5.5 max-sm:px-4.5">
          <span aria-hidden="true" className={`inline-flex size-11 flex-none items-center justify-center rounded-xl ${isIncluded ? "bg-cream text-maroon" : "bg-snow text-muted"}`}>
            <TrailIcon name={isIncluded ? iconOf(point.title) : "close"} size={isIncluded ? 20 : 16} />
          </span>
          <p className="m-0 text-[15px] leading-5.75">
            <strong className="mb-0.5 block text-[17px] leading-6 font-semibold text-ink">{point.title}</strong>
            {point.text}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

/** What the price covers and what it doesn't, each a card as wide as the page, then why meals are extra and how food works on the trail. */
export const TrekInclusions = ({ inclusions, meals }: TrekInclusionsProps) => (
  <section aria-labelledby="inclusions-h" id="inclusions" className="flex flex-col gap-6">
    <SectionHeading id="inclusions-h" eyebrow="One clear price" title={inclusions.heading} />
    {inclusions.included.length > 0 && <PointGrid title="Included in the price" points={inclusions.included} isIncluded />}
    {inclusions.excluded.length > 0 && <PointGrid title="Not included" points={inclusions.excluded} isIncluded={false} />}
    {meals && <TrekMeals meals={meals} />}
  </section>
);

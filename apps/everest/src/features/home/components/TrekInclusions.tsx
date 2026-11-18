import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

import type { HomePoint, HomeTrek } from "../types";
import { TrekMeals } from "./TrekMeals";

type TrekInclusionsProps = Pick<HomeTrek, "inclusions" | "meals">;

/** An icon for an included point by its usual (German) title in the trek editor; a tick for any other. */
const ICONS: Record<string, TrailIconName> = {
  transport: "route",
  "transport vor ort": "route",
  flughafentransfers: "route",
  inlandsflüge: "route",
  guide: "users",
  guides: "users",
  "lizenzierter guide und träger": "users",
  genehmigungen: "doc",
  unterkunft: "bed",
  "übernachtung in teehäusern": "bed",
  "übernachtungen in lodges": "bed",
  sicherheit: "shield",
  sicherheitsausrüstung: "shield",
  verpflegung: "heart",
  mahlzeiten: "heart",
};
const iconOf = (title: string): TrailIconName => ICONS[title.trim().toLowerCase()] ?? "check";

type PointGridProps = { title: string; points: readonly HomePoint[]; isIncluded: boolean };

/**
 * One list as a card (design: what's covered, decided 2026-11-18): a header with its mark and count, then the points
 * one under the other, parted by hairlines.
 */
const PointGrid = ({ title, points, isIncluded }: PointGridProps) => (
  <div className={`h-full overflow-hidden rounded-3xl border border-solid border-line ${isIncluded ? "bg-snow" : "bg-mist"}`}>
    <h3 className="flex items-center justify-between gap-3 border-0 border-b border-solid border-line px-6 py-4.5 text-[22px]! leading-7! max-sm:px-4.5">
      <span className="flex items-center gap-3">
        <span className={`inline-flex size-8 items-center justify-center rounded-full ${isIncluded ? "bg-whatsapp text-snow" : "bg-ice text-ocean"}`}>
          <TrailIcon name={isIncluded ? "check" : "close"} size={isIncluded ? 18 : 15} />
        </span>
        {title}
      </span>
      <span className="rounded-full bg-ice px-2.5 text-[13px] leading-6 font-semibold text-muted">
        {points.length} {points.length === 1 ? "Punkt" : "Punkte"}
      </span>
    </h3>
    <ul className="m-0 flex list-none flex-col divide-y divide-solid divide-line p-0">
      {points.map((point) => (
        <li key={point.title} className="flex gap-4 px-6 py-5 max-sm:px-4.5">
          <span aria-hidden="true" className={`inline-flex size-11 flex-none items-center justify-center rounded-xl ${isIncluded ? "bg-ice text-ocean" : "bg-snow text-muted"}`}>
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

/** What the price covers and what it doesn't, two lists side by side on a laptop, then why meals are extra and how food works on the trail. */
export const TrekInclusions = ({ inclusions, meals }: TrekInclusionsProps) => (
  <section aria-labelledby="inclusions-h" id="inclusions" className="flex flex-col gap-6">
    <SectionHeading id="inclusions-h" eyebrow="Ein klarer Preis" title={inclusions.heading} />
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {inclusions.included.length > 0 && <PointGrid title="Im Preis enthalten" points={inclusions.included} isIncluded />}
      {inclusions.excluded.length > 0 && <PointGrid title="Nicht enthalten" points={inclusions.excluded} isIncluded={false} />}
    </div>
    {meals && <TrekMeals meals={meals} />}
  </section>
);

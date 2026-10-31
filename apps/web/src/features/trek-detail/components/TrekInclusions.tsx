import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { TREK_SECTION_IDS } from "../sections";
import type { TrekDetail, TrekPoint } from "../types";
import { MealsCard } from "./meals/MealsCard";
import { SectionHeading } from "./SectionHeading";

const LOOKS = {
  included: {
    card: "border-green-line bg-green-tint",
    divider: "border-green-line text-whatsapp",
    titleIcon: "verified",
    itemIcon: "check_circle",
    iconColor: "text-whatsapp",
  },
  excluded: {
    card: "border-danger/25 bg-danger-tint",
    divider: "border-danger/25 text-danger",
    titleIcon: "info",
    itemIcon: "close",
    iconColor: "text-danger",
  },
} as const;

type ListLook = { card: string; divider: string; titleIcon: IconName; itemIcon: IconName; iconColor: string };

type TrekInclusionsProps = Pick<TrekDetail, "inclusions" | "meals" | "hiddenSections"> & { heading: string };

type PointListProps = { title: string; points: readonly TrekPoint[]; look: ListLook };

const PointList = ({ title, points, look }: PointListProps) => (
  <div className={`flex flex-col gap-3 rounded-lg border p-5 shadow-card ${look.card}`}>
    <div className={`flex items-center gap-2 border-b pb-2 ${look.divider}`}>
      <Icon name={look.titleIcon} size={22} />
      <h3 className="font-sans text-[15px] font-bold tracking-wide text-inherit uppercase">{title}</h3>
    </div>
    <ul className="flex flex-col gap-2 text-caption font-normal text-text">
      {points.map((point) => (
        <li key={point.title} className="flex items-start gap-2">
          <Icon name={look.itemIcon} size={16} className={`mt-0.5 flex-none ${look.iconColor}`} />
          <p>
            <strong className="text-ink">{point.title}:</strong> {point.text}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

/** "Full disclosure": what the price includes, what you pay for yourself, and why meals are extra. */
export const TrekInclusions = ({ heading, inclusions, meals, hiddenSections }: TrekInclusionsProps) => (
  <section id={TREK_SECTION_IDS.inclusions} aria-labelledby="trek-inclusions-title" className="flex scroll-mt-16 flex-col gap-4 pt-3">
    <SectionHeading id="trek-inclusions-title" eyebrow="Full disclosure" title={heading} />
    <PointList title="Included in the price" points={inclusions.included} look={LOOKS.included} />
    <PointList title="Not included" points={inclusions.excluded} look={LOOKS.excluded} />
    {!hiddenSections.includes("meals") && <MealsCard meals={meals} />}
  </section>
);

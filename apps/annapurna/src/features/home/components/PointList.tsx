import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomePoint } from "../types";

type PointListProps = { points: readonly HomePoint[]; icon: "check" | "close"; iconClass: string };

/** A list of "Title: text" points, each with its icon. */
export const PointList = ({ points, icon, iconClass }: PointListProps) => (
  <ul className="flex flex-col gap-3 text-base leading-6">
    {points.map((point) => (
      <li key={point.title} className="flex items-start gap-2.5">
        <TrailIcon name={icon} size={20} className={`mt-0.5 ${iconClass}`} />
        <span>
          <strong className="font-semibold text-ink">{point.title}{point.text && ":"}</strong> {point.text}
        </span>
      </li>
    ))}
  </ul>
);

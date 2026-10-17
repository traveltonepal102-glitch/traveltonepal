import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import type { TrekPoint } from "../../types";

type MealTipListProps = {
  title: string;
  icon: IconName;
  /** "green" for tips, "saffron" for notes to watch out for. */
  tone: "green" | "saffron";
  points: readonly TrekPoint[];
};

const TONES = {
  green: { title: "text-whatsapp", dot: "bg-whatsapp" },
  saffron: { title: "text-saffron-ink", dot: "bg-saffron" },
} as const;

/** A titled list of short tips, each with a bold lead-in. */
export const MealTipList = ({ title, icon, tone, points }: MealTipListProps) => (
  <div className="flex flex-col gap-2.5 rounded-md border border-line bg-surface p-4 text-xs text-text shadow-card">
    <p className={`inline-flex items-center gap-1.5 font-bold ${TONES[tone].title}`}>
      <Icon name={icon} size={16} />
      {title}
    </p>
    <ul className="flex flex-col gap-2.5">
      {points.map((point) => (
        <li key={point.title} className="flex items-start gap-2">
          <span aria-hidden="true" className={`mt-1.75 size-1.5 flex-none rounded-full ${TONES[tone].dot}`} />
          <p>
            <strong className="text-ink">{point.title}:</strong> {point.text}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

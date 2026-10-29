import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { formatDays } from "../format";

type TrekFactsProps = {
  days: number;
  difficulty: string;
  altitude: string;
};

/** Days, difficulty and highest point as three small boxes. Labels are for screen readers. */
export const TrekFacts = ({ days, difficulty, altitude }: TrekFactsProps) => {
  const facts: readonly { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar_today", label: "Length", value: formatDays(days) },
    { icon: "trending_up", label: "Difficulty", value: difficulty },
    { icon: "altitude", label: "Highest point", value: altitude },
  ];

  return (
    <ul className="grid grid-cols-3 gap-1.5">
      {facts.map((fact) => (
        <li key={fact.label} className="flex flex-col items-start gap-0.5 rounded-md bg-muted px-2.5 py-2">
          <Icon name={fact.icon} size={18} className="text-brand" />
          <span className="text-caption font-bold text-ink">
            <span className="sr-only">{fact.label}: </span>
            {fact.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

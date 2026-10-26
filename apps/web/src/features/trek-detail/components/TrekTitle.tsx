import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { formatAltitude } from "@/features/treks/format";

import type { TrekDetail } from "../types";

const MAX_GRADE = 5;
const TAG = "rounded-sm px-2.5 py-0.75 text-xs";

const maxAltitudeText = (trek: TrekDetail) => {
  const standard = `${formatAltitude(trek.maxAltitudeM)} (${trek.highPoint})`;
  const option = trek.optionalHighPoint;
  return option
    ? `${standard} / ${formatAltitude(option.altitudeM)} (${option.name} option)`
    : standard;
};

/** Tags, the H1 and the key facts in one line (design: Trek.dc.html, title band). */
export const TrekTitle = ({ trek }: { trek: TrekDetail }) => {
  const facts: readonly {
    icon: IconName;
    text: string;
    iconClassName: string;
  }[] = [
    {
      icon: "calendar_month",
      text: trek.daysNote
        ? `${trek.days} days (${trek.daysNote})`
        : `${trek.days} days`,
      iconClassName: "text-brand",
    },
    {
      icon: "trending_up",
      text: `${trek.difficulty} (grade ${trek.grade} of ${MAX_GRADE})`,
      iconClassName: "text-brand",
    },
    {
      icon: "altitude",
      text: `Max altitude: ${maxAltitudeText(trek)}`,
      iconClassName: "text-brand",
    },
    {
      icon: "wb_sunny",
      text: `Best window: ${trek.seasonLabel}`,
      iconClassName: "text-whatsapp",
    },
  ];

  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-3 px-4 pt-6.5 pb-6 md:px-6">
        {/* <ul className="flex flex-wrap gap-2">
          <li className={`${TAG} bg-saffron-tint font-semibold text-saffron-ink`}>{trek.category}</li>
          {trek.protectedArea && <li className={`${TAG} bg-muted font-medium text-text`}>{trek.protectedArea}</li>}
          <li className={`${TAG} inline-flex items-center gap-1 border border-green-line bg-green-tint font-semibold text-whatsapp`}>
            <Icon name="verified" size={14} />
            Locally owned operator
          </li>
        </ul> */}

        <h1 className="text-h2-sm tracking-tight text-ink md:text-[36px] md:leading-[42px]">
          {trek.headline}
        </h1>

        <ul className="flex flex-wrap items-center gap-x-4.5 gap-y-2 pt-0.5 text-body-sm font-medium text-text">
          {facts.map((fact) => (
            <li key={fact.icon} className="inline-flex items-center gap-1.5">
              <Icon
                name={fact.icon}
                size={18}
                className={`flex-none ${fact.iconClassName}`}
              />
              {fact.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";
import { formatAltitude } from "@/features/treks/format";

import type { RegionDetail, RegionFact } from "../types";
import { WRAP } from "./styles";

/** Up to six key facts on a card that overlaps the bottom of the hero; facts not filled in are left out. */
export const RegionFacts = ({ region }: { region: RegionDetail }) => {
  const allFacts: readonly RegionFact[] = [
    { icon: "altitude", tone: "brand", label: "Highest point", value: formatAltitude(region.maxAltitudeM) },
    { icon: "calendar_month", tone: "brand", label: "Trek length", value: region.trekLength },
    { icon: "speed", tone: "danger", label: "Difficulty", value: region.difficulty },
    { icon: "route", tone: "navy", label: "Getting there", value: region.access.short },
    { icon: "description", tone: "navy", label: "Permits", value: region.permits },
    { icon: "wb_sunny", tone: "saffron", label: "Best months", value: region.bestMonthsLabel },
  ];
  const facts = allFacts.filter((fact) => fact.value);

  return (
    <div className={`${WRAP} relative z-5 -mt-14`}>
      {/* One small <dl> per fact: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */}
      <ul className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-surface shadow-raised md:grid-cols-3 xl:grid-cols-6">
        {facts.map((fact) => (
          <li key={fact.label} className="flex items-center gap-3 border-r border-b border-[#eef2f6] px-4 py-4.5">
            <span aria-hidden="true" className={`inline-flex size-10 flex-none items-center justify-center rounded-xl ${ICON_TONES[fact.tone]}`}>
              <Icon name={fact.icon} size={22} />
            </span>
            <dl className="min-w-0">
              <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{fact.label}</dt>
              <dd className="leading-snug font-bold text-ink">{fact.value}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};

import { Icon } from "@ttn/ui/icon";

import { KATHMANDU, NEPAL_MAP_VIEWBOX, NEPAL_OUTLINE_PATH, projectToMap } from "@/features/regions/nepalMap";

import type { RegionDetail } from "../types";
import { CARD } from "./styles";

const LABEL_HALO = "[paint-order:stroke] stroke-white [stroke-linejoin:round]";

/** "Where it is": the region on a map of Nepal, with how to get there. */
export const RegionLocationCard = ({ region }: { region: RegionDetail }) => {
  const pin = projectToMap(region.location.lon, region.location.lat);

  return (
    <aside aria-labelledby="region-where-title" className={`${CARD} flex flex-col gap-3.5 p-5`}>
      <h3 id="region-where-title" className="text-lg font-bold">
        Where it is
      </h3>
      <div className="rounded-xl bg-linear-to-b from-[#f4f8fc] to-brand-tint p-2">
        <svg
          viewBox={NEPAL_MAP_VIEWBOX}
          role="img"
          aria-label={`Map of Nepal showing ${region.name} relative to Kathmandu`}
          className="block h-auto w-full font-sans"
        >
          <path d={NEPAL_OUTLINE_PATH} fill="#fff" stroke="#9db6ce" strokeWidth={3} strokeLinejoin="round" />
          <line x1={KATHMANDU.x} y1={KATHMANDU.y} x2={pin.x} y2={pin.y} strokeWidth={3} strokeDasharray="8 8" className="stroke-brand" />
          <rect
            x={KATHMANDU.x - 7}
            y={KATHMANDU.y - 7}
            width={14}
            height={14}
            transform={`rotate(45 ${KATHMANDU.x} ${KATHMANDU.y})`}
            className="fill-ink"
          />
          <text x={KATHMANDU.x + 18} y={KATHMANDU.y + 32} fontSize={26} fontWeight={700} strokeWidth={6} className={`fill-text ${LABEL_HALO}`}>
            Kathmandu
          </text>
          <circle cx={pin.x} cy={pin.y} r={16} stroke="#fff" strokeWidth={4} className="fill-saffron" />
          <text x={pin.x} y={pin.y - 28} textAnchor="middle" fontSize={30} fontWeight={800} strokeWidth={7} className={`fill-navy ${LABEL_HALO}`}>
            {region.name}
          </text>
        </svg>
      </div>
      <dl className="flex flex-col">
        {region.gettingThere.map((item) => (
          <div key={item.label} className="flex items-start gap-3 border-t border-[#eef2f6] pt-3 pb-1">
            <Icon name={item.icon} size={22} className="flex-none text-brand" />
            <div>
              <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{item.label}</dt>
              <dd className="font-semibold text-ink">{item.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </aside>
  );
};

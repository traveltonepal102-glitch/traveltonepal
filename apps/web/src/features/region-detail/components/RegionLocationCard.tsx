import { Icon } from "@ttn/ui/icon";

import { MapConsentGate } from "@/components/shared/MapConsentGate";
import { NEPAL_MAP_VIEWBOX, NEPAL_OUTLINE_PATH, projectToMap, regionMapEmbedUrl } from "@/features/regions/nepalMap";

import type { RegionDetail } from "../types";
import { CARD } from "./styles";

const LABEL_HALO = "[paint-order:stroke] stroke-white [stroke-linejoin:round]";

/** Until the visitor loads the Google map: Nepal with only the region's pin. */
const DrawnPin = ({ region }: { region: RegionDetail }) => {
  const pin = projectToMap(region.location.lon, region.location.lat);
  return (
    <div className="bg-linear-to-b from-[#f4f8fc] to-brand-tint p-2">
      <svg viewBox={NEPAL_MAP_VIEWBOX} role="img" aria-label={`Map of Nepal showing where ${region.name} is`} className="block h-auto w-full font-sans">
        <path d={NEPAL_OUTLINE_PATH} fill="#fff" stroke="#9db6ce" strokeWidth={3} strokeLinejoin="round" />
        <circle cx={pin.x} cy={pin.y} r={16} stroke="#fff" strokeWidth={4} className="fill-saffron" />
        <text x={pin.x} y={pin.y - 28} textAnchor="middle" fontSize={30} fontWeight={800} strokeWidth={7} className={`fill-navy ${LABEL_HALO}`}>
          {region.name}
        </text>
      </svg>
    </div>
  );
};

/** "Where it is": the region on a Google map (loaded on request), with how to get there. */
export const RegionLocationCard = ({ region }: { region: RegionDetail }) => (
  <aside aria-labelledby="region-where-title" className={`${CARD} flex flex-col gap-3.5 p-5`}>
    <h3 id="region-where-title" className="text-lg font-bold">
      Where it is
    </h3>
    <MapConsentGate preview={<DrawnPin region={region} />} previewLabel={`Map of ${region.name}`} noticePlacement="below">
      <iframe
        src={regionMapEmbedUrl(region.location)}
        title={`Google map of the ${region.name} region`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block aspect-4/3 w-full border-0"
      />
    </MapConsentGate>
    {/* One small <dl> per way: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */}
    {region.gettingThere.length > 0 && (
      <ul className="flex flex-col">
        {region.gettingThere.map((item) => (
          <li key={item.label} className="flex items-start gap-3 border-t border-[#eef2f6] pt-3 pb-1">
            <Icon name={item.icon} size={22} className="flex-none text-brand" />
            <dl>
              <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{item.label}</dt>
              <dd className="font-semibold text-ink">{item.value}</dd>
            </dl>
          </li>
        ))}
      </ul>
    )}
  </aside>
);

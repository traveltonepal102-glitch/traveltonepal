import { formatAltitude } from "@/features/treks/format";

import { stopDays } from "../../routeStops";
import type { RouteStop } from "../../routeStops";
import { PIN_PATH, PIN_STYLES } from "./mapStyles";

const KIND_LABELS: Partial<Record<RouteStop["kind"], string>> = { start: "Start", summit: "High point" };

/** "Stops on the route": every place of the day-by-day plan in walking order, pinned like the map. */
export const RouteStopList = ({ stops }: { stops: readonly RouteStop[] }) => (
  <div className="mt-4">
    <h4 className="text-[13px] font-bold text-ink">Stops on the route</h4>
    <ol className="mt-1 grid sm:grid-cols-2 sm:gap-x-6">
      {stops.map((stop) => (
        <li key={stop.firstDay} className="flex items-center gap-2.5 border-b border-line py-2 text-[13px]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 flex-none">
            <path d={PIN_PATH} strokeWidth={1} className={`${PIN_STYLES[stop.kind].fill} ${PIN_STYLES[stop.kind].stroke}`} />
            <circle cx={12} cy={9} r={2.6} fill="#fff" fillOpacity={0.85} />
          </svg>
          <p className="min-w-0 flex-1">
            <span className="font-bold text-ink">{stop.place}</span>{" "}
            <span className="whitespace-nowrap text-muted-foreground">{formatAltitude(stop.altitudeM)}</span>
            {KIND_LABELS[stop.kind] && (
              <span className="ml-1.5 rounded-sm bg-page px-1.5 py-px text-[11px] font-semibold text-text">{KIND_LABELS[stop.kind]}</span>
            )}
          </p>
          <span className="flex-none text-[11px] font-semibold text-muted-foreground">{stopDays(stop)}</span>
        </li>
      ))}
    </ol>
  </div>
);

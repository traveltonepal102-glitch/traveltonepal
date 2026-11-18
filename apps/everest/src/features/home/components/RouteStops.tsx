import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

/**
 * The nights beside the route map (design: Route map): each day's overnight place and the height it sleeps at, with the
 * day's higher point on one short line under it (the trek's highest point marked in the accent). As tall as the map on
 * a laptop, the list scrolling inside it; a keyboard reaches the list too (it is focusable and named).
 */
export const RouteStops = ({ days }: { days: readonly HomeDay[] }) => (
  <div className="flex flex-col overflow-hidden rounded-3xl border border-solid border-line bg-snow max-lg:max-h-110 lg:h-130">
    <div className="flex flex-none items-center gap-3.5 border-0 border-b border-solid border-line px-5 py-4">
      <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-ice text-ocean">
        <TrailIcon name="bed" size={20} />
      </span>
      <p className="m-0 flex flex-col leading-5">
        <strong id="route-stops-h" className="font-display text-lg font-bold text-ink">
          Übernachtungsorte
        </strong>
        <span className="text-[13px] text-muted">Aus dem Reiseverlauf · Höhe der Nacht</span>
      </p>
    </div>
    {/* Focusable: a list that scrolls inside its box must be reachable by keyboard. */}
    <ol aria-labelledby="route-stops-h" tabIndex={0} className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain p-0 [scrollbar-width:thin]">
      {days.map((day) => {
        const climbsHigher = day.altitudeM > day.nightAltitudeM && Boolean(day.topPlace);
        return (
          <li
            key={day.number}
            className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 border-0 border-t border-solid border-ice px-5 py-3 first:border-t-0 ${
              day.isHighPoint ? "bg-glacier-tint shadow-[inset_3px_0_0_var(--color-glacier)]" : ""
            }`}
          >
            <span aria-hidden="true" className={`mt-0.5 inline-flex size-8 items-center justify-center rounded-full text-[13px] font-bold ${day.isHighPoint ? "bg-glacier text-snow" : "bg-ocean text-snow"}`}>
              {day.number}
            </span>
            <span className="flex min-w-0 flex-col leading-5.5">
              <span className="sr-only">Tag {day.number}: </span>
              <strong className="truncate font-semibold text-ink">{day.place || day.topPlace}</strong>
              {climbsHigher && (
                <span className={`mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] leading-4.5 ${day.isHighPoint ? "font-semibold text-glacier-ink" : "text-muted"}`}>
                  <TrailIcon name="mountain" size={14} className="flex-none" />
                  <span className="sr-only">{day.isHighPoint ? "Höchster Punkt des Treks:" : "Unterwegs auf"}</span>
                  <span className="truncate">{day.topPlace}</span>
                  <span className="flex-none">{formatAltitude(day.altitudeM)}</span>
                </span>
              )}
            </span>
            <span className="pt-0.5 text-sm leading-5 font-semibold whitespace-nowrap text-text">
              <span className="sr-only">Übernachtung auf </span>
              {formatAltitude(day.nightAltitudeM)}
            </span>
          </li>
        );
      })}
    </ol>
  </div>
);

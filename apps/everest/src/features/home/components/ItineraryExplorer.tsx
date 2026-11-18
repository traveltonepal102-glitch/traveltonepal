"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatAltitude } from "@/lib/format";

/** What the chart and the list need of a day (its full panel comes rendered from the server). */
export type ExplorerDay = { number: number; route: string; place: string; nightAltitudeM: number; altitudeM: number; topPlace: string; isHighPoint: boolean };

type ItineraryExplorerProps = { days: readonly ExplorerDay[]; panels: readonly ReactNode[] };

/** The chart's ceiling: a little above the highest point, in thousands of metres. */
const ceilingOf = (days: readonly ExplorerDay[]) => Math.ceil((Math.max(...days.map((day) => day.altitudeM)) + 500) / 1000) * 1000;

/**
 * The itinerary on the dark band (design: Itinerary): the altitude by night as a profile, a numbered marker per day
 * (the high pass labelled between its nights), the list of days and the chosen day in full beside it, with the day
 * before and after. Every day's panel is in the page (only hidden), so search engines read the whole plan.
 */
export const ItineraryExplorer = ({ days, panels }: ItineraryExplorerProps) => {
  const [chosen, setChosen] = useState(() => Math.max(0, days.findIndex((day) => day.isHighPoint)));
  const last = days.length - 1;
  const top = ceilingOf(days);
  const x = (index: number) => (last > 0 ? (index / last) * 100 : 50);
  const y = (metres: number) => (metres / top) * 100;
  const passIndex = days.findIndex((day) => day.isHighPoint);
  // The line runs night to night, and up to the pass between the nights before and after it.
  const points = days.map((day, index) => ({ x: x(index), y: y(day.nightAltitudeM) }));
  if (passIndex > 0) points.splice(passIndex, 0, { x: x(passIndex - 0.5), y: y(days[passIndex].altitudeM) });
  const line = points.map((point, index) => `${index ? "L" : "M"}${(point.x * 10).toFixed(1)} ${(300 - point.y * 3).toFixed(1)}`).join(" ");
  const gridLines = [1000, 3000, 5000].filter((metres) => metres < top);

  return (
    <div className="flex flex-col gap-9">
      <figure className="m-0 rounded-3xl border border-solid border-white/10 bg-white/4 px-7 pt-6 pb-5 max-sm:px-4">
        <figcaption className="flex flex-wrap justify-between gap-2 pb-3 text-sm leading-5">
          <strong className="font-semibold text-mist">Übernachtungshöhe pro Tag: Wähle einen Tag aus</strong>
          {passIndex >= 0 && (
            <span>
              Höchster Punkt: {formatAltitude(days[passIndex].altitudeM)}, {days[passIndex].topPlace} (Tag {days[passIndex].number})
            </span>
          )}
        </figcaption>
        <div className="relative mr-6 ml-16 h-70 max-sm:mr-3 max-sm:ml-12 max-sm:h-52">
          {gridLines.map((metres) => (
            <span key={metres} aria-hidden="true" className="absolute -right-5 -left-16 border-0 border-t border-dashed border-white/12 max-sm:-left-12" style={{ bottom: `${y(metres)}%` }}>
              <span className="absolute -top-2.5 left-0 text-xs text-on-ink-muted">{formatAltitude(metres)}</span>
            </span>
          ))}
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="altitude-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--color-glacier)" stopOpacity=".45" />
                <stop offset="1" stopColor="var(--color-ocean)" stopOpacity=".05" />
              </linearGradient>
            </defs>
            <path d={`${line} L1000 300 L0 300 Z`} fill="url(#altitude-fill)" />
            <path d={line} fill="none" stroke="var(--color-glacier)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {passIndex > 0 && (
            <span aria-hidden="true" className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-3.5 flex-col items-center gap-1" style={{ left: `${x(passIndex - 0.5)}%`, bottom: `${y(days[passIndex].altitudeM)}%` }}>
              <span className="rounded-full bg-mist px-2.5 text-xs leading-4.5 font-bold whitespace-nowrap text-ink">
                {days[passIndex].topPlace} · {formatAltitude(days[passIndex].altitudeM)}
              </span>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M2 20l10-16 10 16z" fill="var(--color-glacier)" stroke="var(--color-ink)" strokeWidth="2" />
              </svg>
            </span>
          )}
          {days.map((day, index) => {
            const isChosen = index === chosen;
            return (
              <button
                key={day.number}
                type="button"
                aria-label={`Tag ${day.number}: ${day.place || day.route}, ${formatAltitude(day.nightAltitudeM)}`}
                aria-pressed={isChosen}
                onClick={() => setChosen(index)}
                className={`absolute flex -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-solid border-mist p-0 font-[inherit] leading-none font-bold transition-transform hover:scale-110 ${isChosen ? "size-10 bg-glacier text-[15px] text-ink shadow-[0_0_0_6px_rgba(227,155,46,0.25)]" : "size-7.5 bg-ocean text-xs text-snow"}`}
                style={{ left: `${x(index)}%`, bottom: `${y(day.nightAltitudeM)}%` }}
              >
                {day.number}
              </button>
            );
          })}
        </div>
        <p className="m-0 mt-4 ml-16 text-xs text-on-ink-muted max-sm:ml-12">Die Zahlen sind die Tage, jede steht auf der Höhe der Übernachtung.</p>
      </figure>

      <div className="flex flex-wrap items-start gap-7">
        <ol className="m-0 flex min-w-0 flex-[1_1_360px] list-none flex-col gap-0.5 p-0">
          {days.map((day, index) => {
            const isChosen = index === chosen;
            return (
              <li key={day.number}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => setChosen(index)}
                  className={`grid min-h-14 w-full cursor-pointer grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-0 px-4 py-2 text-left font-[inherit] text-base leading-5.5 ${isChosen ? "bg-white/10 text-mist shadow-[inset_3px_0_0_var(--color-glacier)]" : "bg-transparent text-on-ocean-muted hover:bg-white/6"}`}
                >
                  <span className="text-xs font-bold tracking-[0.14em] text-glacier">TAG {String(day.number).padStart(2, "0")}</span>
                  <span>{day.route}</span>
                  <span className="text-sm text-on-ink-muted">{formatAltitude(day.nightAltitudeM)}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="min-w-0 flex-[1.4_1_520px] lg:sticky lg:top-24">
          {panels.map((panel, index) => (
            <div key={days[index]?.number ?? index} hidden={index !== chosen}>
              {panel}
            </div>
          ))}
          <div className="mt-4 flex justify-between gap-2.5">
            <button type="button" onClick={() => setChosen(chosen === 0 ? last : chosen - 1)} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-solid border-white/45 bg-white/8 px-4.5 font-[inherit] text-[15px] font-semibold text-mist hover:bg-white/16">
              <TrailIcon name="chevron" size={16} className="rotate-90" />
              Tag {days[chosen === 0 ? last : chosen - 1]?.number}
            </button>
            <button type="button" onClick={() => setChosen(chosen === last ? 0 : chosen + 1)} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-glacier px-4.5 font-[inherit] text-[15px] font-semibold text-ink hover:bg-glacier-deep">
              Tag {days[chosen === last ? 0 : chosen + 1]?.number}
              <TrailIcon name="chevron" size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

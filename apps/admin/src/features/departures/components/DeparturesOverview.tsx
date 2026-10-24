"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import type { DepartureActionResult } from "../actions/results";
import { NO_DEPARTURE_FILTERS, countByStatus, groupDepartures, isMainSeason, isPast, treksWithUpcomingDates } from "../lib/departureList";
import type { DepartureItem, DepartureTrek } from "../types";
import { DepartureFilterBar } from "./DepartureFilterBar";
import { DepartureForm } from "./DepartureForm";
import { DepartureRow } from "./DepartureRow";
import { DepartureTiles } from "./DepartureTiles";
import { RepeatDatesDrawer } from "./repeat/RepeatDatesDrawer";

type DeparturesOverviewProps = {
  departures: DepartureItem[];
  treks: DepartureTrek[];
  /** "YYYY-MM-DD" in Nepal. */
  today: string;
  /** Opens with "Add date" open. */
  isAdding?: boolean;
};

type Panel = { kind: "add" } | { kind: "edit"; departure: DepartureItem } | { kind: "repeat" } | null;

/**
 * Departure dates (design: Admin-departures): every fixed date on every trek, by month, with one-click statuses,
 * "Add date" and "Repeat dates". Each change saves straight away and the list refreshes.
 */
export const DeparturesOverview = ({ departures, treks, today, isAdding = false }: DeparturesOverviewProps) => {
  const [filters, setFilters] = useState(NO_DEPARTURE_FILTERS);
  const [panel, setPanel] = useState<Panel>(isAdding ? { kind: "add" } : null);
  const [notice, setNotice] = useState<DepartureActionResult | null>(null);
  const trekById = new Map(treks.map((trek) => [trek.id, trek]));
  const counts = countByStatus(departures, today);
  const groups = groupDepartures(departures, filters, today);
  const treksWithDates = treks.filter((trek) => departures.some((departure) => departure.trekId === trek.id));

  const finish = (result: DepartureActionResult) => {
    setNotice(result);
    if (result.ok) setPanel(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="event" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Departure dates
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{counts.all} upcoming</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">
            Every fixed date on every trek. Change a status in one click when someone books on WhatsApp. Treks without dates show “Your dates, your pace” on the site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setPanel({ kind: "repeat" })} className={secondaryButton}>
            <Icon name="event_repeat" size={18} />
            Repeat dates
          </button>
          <button type="button" onClick={() => setPanel({ kind: "add" })} className={primaryButton}>
            <Icon name="add" />
            Add date
          </button>
        </div>
      </div>

      {notice && (
        <p role="status" className={cn("m-0 flex items-center gap-2 rounded-md px-3.5 py-2.5 font-semibold", notice.ok ? "bg-green-tint text-whatsapp" : "bg-danger-tint text-danger")}>
          <Icon name={notice.ok ? "check_circle" : "error"} size={18} className="flex-none" />
          <span className="flex-1">{notice.message}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)} className="m-0 inline-flex cursor-pointer border-0 bg-transparent p-1 text-current">
            <Icon name="close" size={16} />
          </button>
        </p>
      )}

      <DepartureTiles upcoming={counts.all} guaranteed={counts.guaranteed} almostFullOrFull={counts.almost_full + counts.full} treksWithDates={treksWithUpcomingDates(departures, today)} trekCount={treks.length} />

      {(panel?.kind === "add" || panel?.kind === "edit") && (
        <DepartureForm key={panel.kind === "edit" ? panel.departure.id : "new"} departure={panel.kind === "edit" ? panel.departure : null} treks={treks} onSaved={finish} onCancel={() => setPanel(null)} />
      )}

      <DepartureFilterBar filters={filters} onChange={setFilters} treks={treksWithDates} counts={counts} />

      {groups.map((group) => (
        <section key={group.key} aria-label={group.title} className="overflow-hidden rounded-lg border border-solid border-border bg-surface">
          <div className={cn("flex flex-wrap items-baseline justify-between gap-2 border-b border-solid border-border px-4 py-3", group.key === "past" ? "bg-muted" : "bg-page")}>
            <h2 className="m-0 flex items-center gap-2 font-display text-h4 text-ink">
              {group.title}
              <span className="rounded-full bg-surface px-2 py-0.5 font-sans text-xs font-bold text-muted-foreground">{group.departures.length === 1 ? "1 date" : `${group.departures.length} dates`}</span>
            </h2>
            <span className="text-xs text-muted-foreground">{group.key === "past" ? "Hidden on the site automatically" : isMainSeason(group.key) && "Main trekking season"}</span>
          </div>
          {group.departures.flatMap((departure) => {
            const trek = trekById.get(departure.trekId);
            if (!trek) return [];
            return [<DepartureRow key={departure.id} departure={departure} trek={trek} isPast={isPast(departure, today)} onEdit={() => setPanel({ kind: "edit", departure })} onResult={setNotice} />];
          })}
        </section>
      ))}
      {!groups.length && (
        <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-muted-foreground">
          {departures.length ? "No dates match these filters." : "No departure dates yet. Add the first one with “Add date”, or a season at once with “Repeat dates”."}
        </p>
      )}

      <p className="m-0 flex items-start gap-2 text-xs text-muted-foreground">
        <Icon name="info" size={16} className="mt-px flex-none" />
        All dates are Nepal dates: the day the trek starts in Kathmandu, shown the same to every visitor wherever they are. Bookings happen on WhatsApp,
        so “places left” is a note you type, not a count. A date is hidden on the site from the day after it starts (in Nepal).
      </p>

      {panel?.kind === "repeat" && <RepeatDatesDrawer treks={treks} departures={departures} today={today} onDone={finish} onClose={() => setPanel(null)} />}
    </>
  );
};

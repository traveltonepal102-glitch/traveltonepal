"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import { iconButton } from "@/components/ui/buttonStyles";
import { trekPath } from "@/features/treks/constants";
import type { DepartureStatus } from "@/features/treks/types";

import { addDepartures } from "../actions/addDepartures";
import { changeDepartureStatus } from "../actions/changeDepartureStatus";
import { removeDeparture } from "../actions/removeDeparture";
import type { DepartureActionResult } from "../actions/results";
import { dayParts, endDate, formatLong, formatShort, nextYearSameWeekday } from "../lib/dates";
import type { DepartureItem, DepartureTrek } from "../types";
import { StatusButtons } from "./StatusButtons";

type DepartureRowProps = {
  departure: DepartureItem;
  trek: DepartureTrek;
  isPast: boolean;
  onEdit: () => void;
  /** A result to show at the top of the page ("Date deleted.", or why not). */
  onResult: (result: DepartureActionResult) => void;
};

/**
 * One date (design: a departure row): the day, the trek and its dates, the status in one click, the notes, and
 * edit / copy to next year / delete. Each change saves straight away.
 */
export const DepartureRow = ({ departure, trek, isPast, onEdit, onResult }: DepartureRowProps) => {
  const [isPending, startTransition] = useTransition();
  // The saved status, except while a click is saving: then the new one, at once. It never goes stale (an edit
  // in the form shows here as soon as the list refreshes), and a failed save falls back by itself.
  const [status, showStatus] = useOptimistic(departure.status);
  const { weekday, day, month } = dayParts(departure.startDate);
  const label = `${trek.name}, ${formatLong(departure.startDate)}`;

  const run = (action: () => Promise<DepartureActionResult>) =>
    startTransition(async () => {
      onResult(await action());
    });

  const changeStatus = (next: DepartureStatus) =>
    startTransition(async () => {
      showStatus(next);
      onResult(await changeDepartureStatus(departure.id, next));
    });
  const copyToNextYear = () =>
    run(() => addDepartures({ trekId: trek.id, status: "open", entries: [{ startDate: nextYearSameWeekday(departure.startDate), note: departure.note }] }));
  const remove = () => {
    if (window.confirm(`Delete the ${label} date? It can't be undone.`)) run(() => removeDeparture(departure.id));
  };

  return (
    <div className={cn("grid items-center gap-3 border-t border-solid border-border px-4 py-3 first:border-t-0 desktop:grid-cols-[56px_minmax(0,1fr)_auto_auto]", isPast && "bg-page", isPending && "opacity-70")}>
      <span className="flex size-14 flex-col items-center justify-center rounded-md bg-brand-tint leading-none text-navy max-desktop:hidden">
        <span className="text-[10px] font-bold uppercase">{weekday}</span>
        <span className="font-display text-xl font-extrabold">{day}</span>
        <span className="text-[10px] font-bold uppercase">{month}</span>
      </span>

      <div className="flex min-w-0 flex-col gap-1">
        <Link href={trekPath(trek.id)} className="truncate font-bold text-ink hover:text-brand">
          {trek.name}
        </Link>
        <span className="text-caption text-muted-foreground">
          <span className="desktop:hidden">{weekday} · </span>
          {formatShort(departure.startDate)} – {formatShort(endDate(departure.startDate, trek.days))}, {departure.startDate.slice(0, 4)} · {trek.days} days
        </span>
        <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {departure.note && (
            <span className="inline-flex items-center gap-1 text-brand">
              <Icon name="public" size={14} />
              {departure.note}
            </span>
          )}
          {departure.specialPriceUsd !== null && (
            <span className="inline-flex items-center gap-1 font-semibold text-whatsapp">
              <Icon name="payments" size={14} />
              Special price ${departure.specialPriceUsd.toLocaleString("en")}
              {trek.priceFromUsd !== null && <span className="font-normal text-muted-foreground line-through">${trek.priceFromUsd.toLocaleString("en")}</span>}
            </span>
          )}
          {departure.teamNote && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Icon name="lock" size={14} />
              {departure.teamNote}
            </span>
          )}
          {!trek.hasFixedDates && (
            <span className="inline-flex items-center gap-1 font-semibold text-saffron-ink">
              <Icon name="visibility_off" size={14} />
              Fixed dates are off on this trek
            </span>
          )}
        </span>
      </div>

      {isPast ? (
        <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-muted-foreground">
          <Icon name="visibility_off" size={16} />
          Past · hidden on site
        </span>
      ) : (
        <StatusButtons label={`Status for ${label}`} value={status} onChange={changeStatus} isDisabled={isPending} />
      )}

      <div className="flex gap-1.5">
        <button type="button" className={iconButton} aria-label={`Edit ${label}`} title="Edit" onClick={onEdit}>
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className={iconButton} aria-label={`Copy ${label} to next year`} title="Copy to next year" disabled={isPending} onClick={copyToNextYear}>
          <Icon name="content_copy" size={18} />
        </button>
        <button type="button" className={iconButton} aria-label={`Delete ${label}`} title="Delete" disabled={isPending} onClick={remove}>
          <Icon name="delete" size={18} />
        </button>
      </div>
    </div>
  );
};

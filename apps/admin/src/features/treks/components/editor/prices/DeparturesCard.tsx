"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useId, useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { DEPARTURES_PATH } from "@/features/departures/constants";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { DEPARTURE_STATUSES, MAX_DEPARTURES, PRICE_LIMITS as LIMIT } from "../../../constants";
import type { Departure, DepartureStatus } from "../../../types";

/** The status a menu value stands for (menu values come from DEPARTURE_STATUSES). */
const statusOf = (value: string, current: DepartureStatus) => DEPARTURE_STATUSES.find((status) => status.value === value)?.value ?? current;

type DeparturesCardProps = {
  hasFixedDates: boolean;
  departures: Departure[];
  /** "YYYY-MM-DD" in Nepal, to mark past dates. */
  today: string;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "2026-11-02" → "2 Nov 2026" (no time zone involved: it is a calendar day). */
const formatDay = (isoDate: string) =>
  isoDate ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${isoDate}T00:00:00Z`)) : "";

/**
 * Optional fixed departure dates (design: "Departure dates"). Off, the trek page shows "Your dates, your pace";
 * the dates stay saved either way. Dates in the past are kept here and hidden from the website.
 */
export const DeparturesCard = ({ hasFixedDates, departures, today, errors, onEdit }: DeparturesCardProps) => {
  const id = useId();
  const [isOn, setIsOn] = useState(hasFixedDates);
  const list = useRowList<Departure>(departures, onEdit);
  const rowError = (index: number, field: string) => errors[`departures.${index}.${field}`];

  return (
    <FormSection
      title="Departure dates"
      hint="Optional. With dates, the trek page shows a date picker. Without, it shows “Your dates, your pace”. Dates are Nepal dates: the day the trek starts in Kathmandu."
      aside={
        <label className="flex cursor-pointer items-center gap-2 text-caption font-bold whitespace-nowrap text-ink">
          <input type="checkbox" name="hasFixedDates" checked={isOn} onChange={(event) => setIsOn(event.target.checked)} className="size-4 accent-brand" />
          {isOn ? "Has fixed dates" : "No fixed dates"}
        </label>
      }
    >
      {!isOn && (
        <div className="flex items-start gap-3 rounded-lg border border-solid border-green-line bg-green-tint p-3.5 text-text">
          <Icon name="calendar_month" className="flex-none text-whatsapp" />
          <div>
            <p className="m-0 text-xs font-bold tracking-wider text-whatsapp uppercase">What visitors see instead</p>
            <p className="m-0 font-display text-h4 text-ink">Your dates, your pace</p>
            <p className="m-0 text-caption">This trek runs any day you choose. Tell us your dates on WhatsApp and we plan it around you.</p>
          </div>
        </div>
      )}

      <div hidden={!isOn} className="flex flex-col gap-2">
        {list.rows.map((row, index) => {
          const isPast = Boolean(row.startDate) && row.startDate < today;
          const dateId = `${id}-date-${row.key}`;
          return (
            <div key={row.key} className={cn("grid items-start gap-2 rounded-lg border border-solid border-border p-2 tablet:grid-cols-[180px_150px_minmax(0,1fr)_40px]", isPast && "bg-page")}>
              <input type="hidden" name="departureId" value={row.id ?? ""} />
              <div className="flex flex-col gap-1">
                <label htmlFor={dateId} className="sr-only">
                  Start date, row {index + 1}
                </label>
                <input
                  id={dateId}
                  type="date"
                  name="departureDate"
                  value={row.startDate}
                  onChange={(event) => list.update(row.key, { startDate: event.target.value })}
                  aria-invalid={rowError(index, "startDate") ? true : undefined}
                  className={cn(inputClass, "cursor-pointer")}
                />
                <span className="text-xs text-muted-foreground">
                  {formatDay(row.startDate)}
                  {isPast && <strong className="ml-1 text-saffron-ink">· Past, hidden on the website</strong>}
                </span>
                <FieldError id={`${dateId}-error`} message={rowError(index, "startDate")} />
              </div>
              <label className="flex flex-col">
                <span className="sr-only">Status, row {index + 1}</span>
                <select
                  name="departureStatus"
                  value={row.status}
                  onChange={(event) => list.update(row.key, { status: statusOf(event.target.value, row.status) })}
                  aria-invalid={rowError(index, "status") ? true : undefined}
                  className={cn(inputClass, "cursor-pointer pr-8 font-semibold")}
                >
                  {DEPARTURE_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                name="departureNote"
                label={`Small note, row ${index + 1}`}
                isLabelHidden
                value={row.note}
                onValueChange={(note) => list.update(row.key, { note })}
                placeholder="Small note, e.g. 4 places left"
                maxLength={LIMIT.note}
                error={rowError(index, "note")}
              />
              <button type="button" className={cn(ghostIconButton, "mt-1")} aria-label={`Remove the date in row ${index + 1}`} onClick={() => list.remove(row.key)}>
                <Icon name="delete" size={18} />
              </button>
            </div>
          );
        })}
        {!list.rows.length && <p className="m-0 text-caption text-muted-foreground">No dates yet. Add the first one.</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => list.add({ id: null, startDate: "", status: "open", note: "" })}
            disabled={list.rows.length >= MAX_DEPARTURES}
            className={cn(secondaryButton, "min-h-8 px-3 text-caption")}
          >
            <Icon name="add" size={16} />
            Add a date
          </button>
          <Link href={DEPARTURES_PATH} className="text-caption font-bold text-brand">
            Repeat or copy a season
          </Link>
          <span className="text-xs text-muted-foreground">Dates in the past are hidden from the website automatically.</span>
        </div>
        <FieldError id="departures-error" message={errors.departures} />
      </div>
    </FormSection>
  );
};

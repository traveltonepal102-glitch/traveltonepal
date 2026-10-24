"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { iconButton, primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormAlert } from "@/components/ui/FormAlert";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { PRICE_LIMITS } from "@/features/treks/constants";
import type { DepartureStatus } from "@/features/treks/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { saveDeparture } from "../actions/saveDeparture";
import type { DepartureActionResult } from "../actions/results";
import { DEPARTURE_LIMITS } from "../constants";
import { endDate, formatLong } from "../lib/dates";
import type { DepartureItem, DepartureTrek } from "../types";
import { StatusButtons } from "./StatusButtons";

type DepartureFormProps = {
  /** The date being edited; null to add one. */
  departure: DepartureItem | null;
  treks: DepartureTrek[];
  /** Saved: closes the form and shows the message. */
  onSaved: (result: DepartureActionResult) => void;
  onCancel: () => void;
};

/** "Add a departure date" (design: the add panel), also used to edit one. The end date follows the trek's days. */
export const DepartureForm = ({ departure, treks, onSaved, onCancel }: DepartureFormProps) => {
  const id = useId();
  const [trekId, setTrekId] = useState(departure?.trekId ?? treks[0]?.id ?? "");
  const [startDate, setStartDate] = useState(departure?.startDate ?? "");
  const [status, setStatus] = useState<DepartureStatus>(departure?.status ?? "open");
  const [failure, setFailure] = useState<{ message: string; fieldErrors: FieldErrors } | null>(null);
  const [isSaving, startTransition] = useTransition();
  const trek = treks.find((option) => option.id === trekId);
  const errors = failure?.fieldErrors ?? {};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await saveDeparture(departure?.id ?? null, formData);
      if (result.ok) onSaved(result);
      else setFailure({ message: result.message, fieldErrors: result.fieldErrors ?? {} });
    });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-4 rounded-lg border border-solid border-brand/30 bg-surface p-5 shadow-card max-tablet:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id={`${id}-title`} className="m-0 font-display text-h4 text-ink">
            {departure ? "Edit departure date" : "Add a departure date"}
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Nepal dates: the day the trek starts and ends in Nepal. The end date fills in from the trek’s number of days. Adding a date switches on fixed
            dates for the trek.
          </p>
        </div>
        <button type="button" className={iconButton} aria-label="Close" onClick={onCancel}>
          <Icon name="close" size={20} />
        </button>
      </div>
      {failure && <FormAlert message={failure.message} />}

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-3 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-trek`} className={labelClass}>
              Trek
            </label>
            <select
              id={`${id}-trek`}
              name="trekId"
              value={trekId}
              onChange={(event) => setTrekId(event.target.value)}
              aria-invalid={errors.trekId ? true : undefined}
              className={cn(inputClass, "cursor-pointer pr-8")}
            >
              {treks.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} — {option.days} days
                </option>
              ))}
            </select>
            <FieldError id={`${id}-trek-error`} message={errors.trekId} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-start`} className={labelClass}>
              Start date <span className="font-medium text-muted-foreground">(Nepal date)</span>
            </label>
            <input
              id={`${id}-start`}
              type="date"
              name="startDate"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              aria-invalid={errors.startDate ? true : undefined}
              aria-describedby={errors.startDate ? `${id}-start-error` : undefined}
              className={cn(inputClass, "cursor-pointer")}
            />
            <FieldError id={`${id}-start-error`} message={errors.startDate} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>
              End date <span className="font-medium text-muted-foreground">(automatic)</span>
            </span>
            <span className={cn(inputClass, "flex items-center bg-page text-text")}>{startDate && trek ? formatLong(endDate(startDate, trek.days)) : "—"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Status</span>
          <StatusButtons label="Status for the new date" name="status" value={status} onChange={setStatus} />
        </div>

        <div className="grid gap-3 tablet:grid-cols-3">
          <TextField name="note" label="Short note on the site" labelNote="(optional)" defaultValue={departure?.note ?? ""} placeholder="e.g. 4 places left" maxLength={PRICE_LIMITS.note} error={errors.note} />
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute top-9.5 left-3 font-bold text-muted-foreground">
              $
            </span>
            <TextField
              name="specialPriceUsd"
              label="Special price"
              labelNote="(optional)"
              inputMode="numeric"
              defaultValue={departure?.specialPriceUsd === null || !departure ? "" : String(departure.specialPriceUsd)}
              placeholder={trek?.priceFromUsd ? `Normal: ${trek.priceFromUsd}` : "Per person"}
              error={errors.specialPriceUsd}
              inputClassName="pl-7"
            />
          </div>
          <TextField name="teamNote" label="Team note" hint="Never shown on the site." defaultValue={departure?.teamNote ?? ""} maxLength={DEPARTURE_LIMITS.teamNote} error={errors.teamNote} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={isSaving} className={primaryButton}>
            {isSaving ? "Saving…" : departure ? "Save date" : "Add date"}
          </button>
          <button type="button" onClick={onCancel} className={secondaryButton}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

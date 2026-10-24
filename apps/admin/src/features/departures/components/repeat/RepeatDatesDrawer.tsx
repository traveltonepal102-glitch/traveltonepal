"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState, useTransition } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { SideDrawer } from "@/components/ui/SideDrawer";
import type { DepartureStatus } from "@/features/treks/types";

import { addDepartures } from "../../actions/addDepartures";
import type { DepartureActionResult } from "../../actions/results";
import { addDays } from "../../lib/dates";
import type { RepeatPattern } from "../../lib/dates";
import type { RepeatMode } from "../../lib/repeatPlan";
import { planDates, seasonsWithDates } from "../../lib/repeatPlan";
import type { DepartureItem, DepartureTrek } from "../../types";
import { StatusButtons } from "../StatusButtons";
import { RepeatPatternFields, choiceClass } from "./RepeatPatternFields";
import { RepeatPreviewList } from "./RepeatPreviewList";

type RepeatDatesDrawerProps = {
  treks: DepartureTrek[];
  departures: DepartureItem[];
  /** "YYYY-MM-DD" in Nepal: the pattern starts here. */
  today: string;
  onDone: (result: DepartureActionResult) => void;
  onClose: () => void;
};


/** "Add many dates at once" (design: Repeat dates): a weekday pattern or last season copied, checked before adding. */
export const RepeatDatesDrawer = ({ treks, departures, today, onDone, onClose }: RepeatDatesDrawerProps) => {
  const id = useId();
  const [mode, setMode] = useState<RepeatMode>("pattern");
  const [trekId, setTrekId] = useState(treks[0]?.id ?? "");
  const [pattern, setPattern] = useState<RepeatPattern>({ from: today, until: addDays(today, 60), weekday: 6, everyDays: 14 });
  const [seasonKey, setSeasonKey] = useState("");
  const [status, setStatus] = useState<DepartureStatus>("open");
  const [unticked, setUnticked] = useState(new Set<string>());
  const [error, setError] = useState("");
  const [isAdding, startTransition] = useTransition();

  const trek = treks.find((option) => option.id === trekId);
  const trekDates = departures.filter((departure) => departure.trekId === trekId);
  const seasons = seasonsWithDates(trekDates);
  const season = seasons.find((option) => option.key === seasonKey) ?? seasons[0];
  const planned = planDates(mode, pattern, season?.key ?? "", trekDates);
  const toAdd = planned.filter((date) => date.clash !== "same_day" && !unticked.has(date.startDate));

  const toggle = (startDate: string) =>
    setUnticked((current) => {
      const next = new Set(current);
      if (!next.delete(startDate)) next.add(startDate);
      return next;
    });
  const add = () =>
    startTransition(async () => {
      const result = await addDepartures({ trekId, status, entries: toAdd.map(({ startDate, note }) => ({ startDate, note })) });
      if (result.ok) onDone(result);
      else setError(result.message);
    });

  return (
    <SideDrawer kicker="Repeat dates" title="Add many dates at once" onClose={onClose}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
        <p className="m-0 text-caption text-muted-foreground">Make a season of dates in one go. Check the list before you add them.</p>
        {error && <FormAlert message={error} />}
        <div className="flex gap-1.5">
          <button type="button" aria-pressed={mode === "pattern"} onClick={() => setMode("pattern")} className={choiceClass(mode === "pattern")}>
            Repeat a pattern
          </button>
          <button type="button" aria-pressed={mode === "copy"} onClick={() => setMode("copy")} className={choiceClass(mode === "copy")}>
            Copy a season
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-trek`} className={labelClass}>
            Trek
          </label>
          <select id={`${id}-trek`} value={trekId} onChange={(event) => setTrekId(event.target.value)} className={cn(inputClass, "cursor-pointer pr-8")}>
            {treks.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} — {option.days} days
              </option>
            ))}
          </select>
        </div>

        {mode === "pattern" ? (
          <RepeatPatternFields pattern={pattern} onChange={setPattern} />
        ) : seasons.length ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-season`} className={labelClass}>
              Copy the dates from
            </label>
            <select id={`${id}-season`} value={season?.key} onChange={(event) => setSeasonKey(event.target.value)} className={cn(inputClass, "cursor-pointer pr-8")}>
              {seasons.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label} — {option.count === 1 ? "1 date" : `${option.count} dates`}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">Moved one year on, on the same weekday. Notes are copied; special prices are not.</span>
          </div>
        ) : (
          <p className="m-0 rounded-md bg-page px-3 py-2.5 text-caption text-muted-foreground">{trek?.name ?? "This trek"} has no dates to copy yet. Use “Repeat a pattern”.</p>
        )}

        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Status for the new dates</span>
          <StatusButtons label="Status for the new dates" value={status} onChange={setStatus} />
        </div>
        <RepeatPreviewList dates={planned} days={trek?.days ?? 1} unticked={unticked} onToggle={toggle} />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
        <button type="button" disabled={isAdding || !toAdd.length} onClick={add} className={primaryButton}>
          {isAdding ? "Adding…" : `Add ${toAdd.length === 1 ? "1 date" : `${toAdd.length} dates`}`}
        </button>
        <Dialog.Close type="button" className={secondaryButton}>
          Cancel
        </Dialog.Close>
      </div>
    </SideDrawer>
  );
};

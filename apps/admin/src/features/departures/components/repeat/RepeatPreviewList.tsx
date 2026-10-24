import { cn } from "@ttn/ui/lib/utils";

import { labelClass } from "@/components/ui/formStyles";

import { endDate, formatLong, formatShort } from "../../lib/dates";
import type { PlannedDate } from "../../lib/repeatPlan";

type RepeatPreviewListProps = {
  dates: PlannedDate[];
  /** The trek's length, for each date's end. */
  days: number;
  unticked: Set<string>;
  onToggle: (startDate: string) => void;
};

const CLASH_LABELS = { same_day: "Already on this day: skipped", same_week: "Already a date that week" } as const;

/** "These dates will be added" (design): every planned date with a tick box; days the trek already has can't be ticked. */
export const RepeatPreviewList = ({ dates, days, unticked, onToggle }: RepeatPreviewListProps) => {
  const count = dates.filter((date) => date.clash !== "same_day" && !unticked.has(date.startDate)).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className={labelClass}>These dates will be added</span>
        <span className="text-xs text-muted-foreground">{count === 1 ? "1 date" : `${count} dates`} · untick any you don’t want</span>
      </div>
      {dates.length ? (
        <ul className="m-0 flex max-h-80 list-none flex-col gap-1.5 overflow-y-auto p-0">
          {dates.map((date) => {
            const isSkipped = date.clash === "same_day";
            const isOn = !isSkipped && !unticked.has(date.startDate);
            return (
              <li key={date.startDate}>
                <label className={cn("flex items-center gap-3 rounded-md border border-solid border-border px-3 py-2", isSkipped ? "cursor-not-allowed bg-page text-subtle" : "cursor-pointer", !isOn && !isSkipped && "bg-page text-muted-foreground")}>
                  <input type="checkbox" checked={isOn} disabled={isSkipped} onChange={() => onToggle(date.startDate)} className="size-4 accent-brand" />
                  <span className="flex-1 text-caption font-semibold">
                    {formatLong(date.startDate)} → {formatShort(endDate(date.startDate, days))}
                    {date.note && <span className="font-normal text-muted-foreground"> · {date.note}</span>}
                  </span>
                  {date.clash && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", isSkipped ? "bg-muted text-muted-foreground" : "bg-saffron-tint text-saffron-ink")}>{CLASH_LABELS[date.clash]}</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="m-0 rounded-md border border-dashed border-line-strong bg-page px-4 py-5 text-center text-caption text-muted-foreground">No dates match. Change the days or the weekday.</p>
      )}
    </div>
  );
};

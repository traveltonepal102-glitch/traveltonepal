import { cn } from "@ttn/ui/lib/utils";

import { inputClass } from "@/components/ui/formStyles";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextField } from "@/components/ui/TextField";
import { MONTH_NAMES, MONTH_RATING_LABELS, NEXT_MONTH_RATING } from "@/features/regions/constants";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import type { MonthRating } from "@/lib/supabase/database.types";

import { CROWDS, CROWD_VALUES, SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import type { Crowds, MonthEntry } from "../../../../types";

type View = "strip" | "table";

type MonthsFieldsProps = {
  heading: string;
  view: View;
  /** The guide's 12 months, shared by all its "Month by month" sections. */
  months: MonthEntry[];
  /** e.g. "sections.2" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { heading?: string; view?: View }) => void;
  onMonthsChange: (months: MonthEntry[]) => void;
};

const VIEWS: { value: View; label: string }[] = [
  { value: "strip", label: "Colour strip" },
  { value: "table", label: "Table with notes" },
];

const RATING_CLASSES: Record<MonthRating, string> = {
  best: "bg-month-best text-white",
  possible: "bg-month-possible text-navy",
  avoid: "bg-month-avoid text-muted-foreground",
};

const crowdsOf = (value: string): Crowds | "" => CROWD_VALUES.find((crowds) => crowds === value) ?? "";

/** "Month by month": a heading, then the guide's months as a colour strip or a table with notes and crowds. */
export const MonthsFields = ({ heading, view, months, field, errors, onChange, onMonthsChange }: MonthsFieldsProps) => {
  const update = (index: number, patch: Partial<MonthEntry>) => onMonthsChange(months.map((month, at) => (at === index ? { ...month, ...patch } : month)));

  return (
    <>
      <TextField
        name="sectionMonthsHeading"
        label="Heading · H2"
        value={heading}
        onValueChange={(next) => onChange({ heading: next })}
        placeholder="Langtang seasons at a glance"
        maxLength={LIMIT.heading}
        error={errors[`${field}.heading`]}
        inputClassName="h-11.5 font-display text-lg font-bold"
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-label text-ink">Show as</span>
        <SegmentedControl label="Show as" options={VIEWS} value={view} onChange={(next) => onChange({ view: next })} />
        <span className="text-xs text-muted-foreground">Both use the same 12 months, so you fill them in once per guide.</span>
      </div>
      <div role="group" aria-label="Months" className="grid grid-cols-12 gap-1 max-tablet:grid-cols-6">
        {months.map((month, index) => (
          <button
            key={MONTH_NAMES[index]}
            type="button"
            onClick={() => update(index, { rating: NEXT_MONTH_RATING[month.rating] })}
            aria-label={`${MONTH_NAMES[index]}: ${MONTH_RATING_LABELS[month.rating]}. Click to change.`}
            className={cn("m-0 flex cursor-pointer flex-col items-center gap-0.5 rounded-md border-0 py-2 font-sans text-xs font-bold focus-visible:outline-2 focus-visible:outline-ring", RATING_CLASSES[month.rating])}
          >
            {MONTH_NAMES[index]}
            <span className="text-[10px] font-semibold">{MONTH_RATING_LABELS[month.rating]}</span>
          </button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">Click a month to switch Best → Possible → Not ideal. These are the 3 colours on the page.</span>
      {view === "table" && (
        <div className="overflow-hidden rounded-lg border border-solid border-border">
          <div className="grid grid-cols-[110px_minmax(0,1fr)_130px] gap-2 bg-page px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase max-tablet:hidden">
            <span>Month</span>
            <span>On the trail</span>
            <span>Crowds</span>
          </div>
          {months.map((month, index) => (
            <div key={MONTH_NAMES[index]} className="grid items-center gap-2 border-t border-solid border-border px-3 py-1.5 tablet:grid-cols-[110px_minmax(0,1fr)_130px]">
              <span className="flex items-center gap-1.5 text-caption font-bold text-ink">
                <span aria-hidden="true" className={cn("size-2.5 rounded-xs", RATING_CLASSES[month.rating])} />
                {MONTH_NAMES[index]}
              </span>
              <input
                aria-label={`${MONTH_NAMES[index]}: on the trail`}
                value={month.onTheTrail}
                onChange={(event) => update(index, { onTheTrail: event.target.value })}
                placeholder="Clear skies, cold nights"
                maxLength={LIMIT.monthNote}
                aria-invalid={errors[`months.${index}.onTheTrail`] ? true : undefined}
                className={cn(inputClass, "h-8.5 text-caption")}
              />
              <select
                aria-label={`${MONTH_NAMES[index]}: crowds`}
                value={month.crowds}
                onChange={(event) => update(index, { crowds: crowdsOf(event.target.value) })}
                className={cn(inputClass, "h-8.5 cursor-pointer pr-7 text-caption")}
              >
                <option value="">—</option>
                {CROWDS.map((crowds) => (
                  <option key={crowds.value} value={crowds.value}>
                    {crowds.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
      {view === "table" && <span className="text-xs text-muted-foreground">“Our verdict” in the table comes from the colour of each month.</span>}
    </>
  );
};

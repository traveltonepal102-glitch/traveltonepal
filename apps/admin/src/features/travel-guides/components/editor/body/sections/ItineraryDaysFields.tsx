import { SelectField } from "@/components/ui/SelectField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { MAX_DAYS_SHOWN } from "../../../../sectionKinds";
import { ToggleChipsField } from "../pickers/ToggleChipsField";

type ItineraryDaysFieldsProps = {
  trekId: string | null;
  dayIds: string[];
  treks: SectionContext["treks"];
  /** e.g. "sections.5" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { trekId?: string | null; dayIds?: string[] }) => void;
};

/** "Itinerary days": some days of a trek's day-by-day plan; their words come from the trek, as saved there. */
export const ItineraryDaysFields = ({ trekId, dayIds, treks, field, errors, onChange }: ItineraryDaysFieldsProps) => {
  const trek = treks.find((item) => item.id === trekId);
  // Shown in the trek's order, whichever order they were picked in.
  const inTrekOrder = (ids: string[]) => (trek ? trek.itinerary.filter((day) => ids.includes(day.id)).map((day) => day.id) : ids);

  return (
    <>
      <SelectField
        name="sectionDaysTrek"
        label="Trek"
        placeholder="Pick a trek"
        options={treks.map((item) => ({ value: item.id, label: item.name }))}
        defaultValue={trekId ?? ""}
        onValueChange={(value) => onChange({ trekId: value || null, dayIds: [] })}
        error={errors[`${field}.trekId`]}
      />
      {trek && (
        <ToggleChipsField
          label="Days"
          field={`${field}.dayIds`}
          options={trek.itinerary.map((day) => ({ value: day.id, label: `Day ${day.number} · ${day.title || "Untitled day"}` }))}
          values={dayIds}
          max={MAX_DAYS_SHOWN}
          hint="They show in the trek’s order, with the walking time and altitude from the trek."
          error={errors[`${field}.dayIds`]}
          onChange={(next) => onChange({ dayIds: inTrekOrder(next) })}
        />
      )}
      {trek && !trek.itinerary.length && <p className="m-0 text-caption text-muted-foreground">This trek has no day-by-day plan yet. Add its days in Treks first.</p>}
    </>
  );
};

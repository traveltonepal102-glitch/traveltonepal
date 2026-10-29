import { Icon } from "@ttn/ui/icon";

import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type AltitudeFieldsProps = {
  trekId: string | null;
  heading: string;
  treks: SectionContext["treks"];
  /** e.g. "sections.5" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { trekId?: string | null; heading?: string }) => void;
};

type Trek = SectionContext["treks"][number];

/** The chart needs two days with an altitude, as on the trek page. */
const daysWithAltitude = (trek: Trek) => trek.itinerary.filter((day) => day.altitudeM !== null);

const metres = (value: number) => `${value.toLocaleString("en")} m`;

/** "12 days · from 1,460 m · high point 4,984 m on day 7", from the trek's day-by-day plan. */
const chartLine = (trek: Trek) => {
  const days = daysWithAltitude(trek);
  const [first] = days;
  const peak = days.reduce((high, day) => ((day.altitudeM ?? 0) > (high.altitudeM ?? 0) ? day : high), first);
  return `${trek.itinerary.length} days · from ${metres(first.altitudeM ?? 0)} · high point ${metres(peak.altitudeM ?? 0)} on day ${peak.number}`;
};

/** "Altitude chart": a trek's altitude curve, drawn on the website from its day-by-day plan. */
export const AltitudeFields = ({ trekId, heading, treks, field, errors, onChange }: AltitudeFieldsProps) => {
  const charted = treks.filter((trek) => daysWithAltitude(trek).length >= 2);
  const trek = charted.find((item) => item.id === trekId);
  const isWithoutPlan = trekId !== null && !trek;

  return (
    <>
      <div className="grid gap-3 tablet:grid-cols-2">
        <SelectField
          name="sectionAltitudeTrekId"
          label="Trek"
          placeholder="Pick a trek"
          hint="Treks whose day-by-day plan has altitudes."
          options={charted.map((item) => ({ value: item.id, label: item.name }))}
          defaultValue={trek ? trek.id : ""}
          onValueChange={(value) => onChange({ trekId: value || null })}
          error={errors[`${field}.trekId`]}
        />
        <TextField name="sectionAltitudeHeading" label="Heading" labelNote="(optional)" value={heading} onValueChange={(next) => onChange({ heading: next })} placeholder="How high you sleep each night" maxLength={LIMIT.heading} error={errors[`${field}.heading`]} />
      </div>
      {trek && (
        <p className="m-0 flex items-center gap-2 rounded-lg border border-solid border-border bg-page px-3 py-2.5 text-caption text-ink">
          <Icon name="altitude" size={18} className="flex-none text-brand" />
          <span>
            <strong>{trek.name}</strong>: {chartLine(trek)}. <span className="text-whatsapp">The chart updates by itself when the trek’s days change.</span>
          </span>
        </p>
      )}
      {isWithoutPlan && <p className="m-0 rounded-md bg-saffron-tint px-3 py-2 text-caption text-saffron-ink">This trek’s day-by-day plan has fewer than two altitudes now: pick another trek, or add the altitudes to its days.</p>}
    </>
  );
};

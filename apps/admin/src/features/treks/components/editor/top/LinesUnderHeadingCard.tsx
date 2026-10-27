"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { useState } from "react";
import type { ReactNode } from "react";

import { SourceNote } from "@/components/editor/SourceNote";
import type { ValueSource } from "@/components/editor/SourceNote";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT, difficultyOf } from "../../../constants";
import type { TrekValues } from "../../../types";

type LinesUnderHeadingCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

const metres = (value: number | null) => (value === null ? "…" : `${value.toLocaleString("en")} m`);

/** One line as the page shows it, and where its number comes from. */
const Line = ({ icon, from, children }: { icon: IconName; from: ValueSource; children: ReactNode }) => (
  <li className="flex items-start gap-2 text-caption text-text">
    <Icon name={icon} size={18} className="mt-px flex-none text-brand" />
    <span className="flex flex-col gap-0.5">
      {children}
      <SourceNote from={from} />
    </span>
  </li>
);

/**
 * "Four lines under the heading" (design): days, difficulty, highest point and best time, with icons. Only the
 * words around the numbers are typed here; days, altitude, difficulty and season come from their own fields.
 */
export const LinesUnderHeadingCard = ({ values, errors }: LinesUnderHeadingCardProps) => {
  const [daysNote, setDaysNote] = useState(values.daysNote);
  const [highPoint, setHighPoint] = useState(values.highPoint);
  const [side, setSide] = useState(values.optionalHighPoint);
  const [sideAltitude, setSideAltitude] = useState(values.optionalHighPointM === null ? "" : String(values.optionalHighPointM));
  const { label } = difficultyOf(values.difficulty);
  // With a day-by-day plan, the days and highest point come from it (Trip overview otherwise).
  const numbersFrom: ValueSource = { section: values.itinerary.length ? "itinerary" : "facts" };
  // Typed as text ("4984" or "4,984"): shown like the main altitude when it reads as a number.
  const sideNumber = Number(sideAltitude.replace(/,/g, "").trim());
  const sideMetres = Number.isFinite(sideNumber) ? metres(sideNumber) : `${sideAltitude.trim()} m`;
  const sideText = side.trim() && sideAltitude.trim() ? ` / ${sideMetres} (${side.trim()} option)` : "";

  return (
    <FormSection
      title="Four lines under the heading"
      hint="Quick facts with icons, right under the big heading of the trek page. Shown as last saved, with your changes below. Only the words in the boxes below are typed here; each number comes from the place named under it."
    >
      <ul className="m-0 flex list-none flex-col gap-2 rounded-md bg-page p-3">
        <Line icon="calendar_month" from={numbersFrom}>
          {values.days ?? "…"} days{daysNote.trim() && ` (${daysNote.trim()})`}
        </Line>
        <Line icon="trending_up" from={{ note: "Change it in Difficulty, below in this section." }}>
          {label} (grade {values.grade} of 5)
        </Line>
        <Line icon="altitude" from={numbersFrom}>
          Max altitude: {metres(values.maxAltitudeM)}
          {highPoint.trim() && ` (${highPoint.trim()})`}
          {sideText}
        </Line>
        <Line icon="wb_sunny" from={{ section: "facts" }}>
          Best window: {values.seasonLabel.trim() || "…"}
        </Line>
      </ul>
      <div className="grid gap-3 tablet:grid-cols-2">
        <TextField name="daysNote" label="After the days" value={daysNote} onValueChange={setDaysNote} placeholder="Kathmandu return" maxLength={LIMIT.daysNote} error={errors.daysNote} />
        <TextField name="highPoint" label="Name of the highest point" value={highPoint} onValueChange={setHighPoint} placeholder="Kyanjin Ri" maxLength={LIMIT.highPoint} error={errors.highPoint} />
      </div>
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TextField
          name="optionalHighPoint"
          label="Higher side trip"
          labelNote="(optional)"
          hint="A higher viewpoint some trekkers add instead."
          value={side}
          onValueChange={setSide}
          placeholder="Tserko Ri"
          maxLength={LIMIT.highPoint}
          error={errors.optionalHighPoint}
        />
        <TextField
          name="optionalHighPointM"
          label="Its altitude (m)"
          inputMode="numeric"
          value={sideAltitude}
          onValueChange={setSideAltitude}
          placeholder="4984"
          error={errors.optionalHighPointM}
        />
      </div>
    </FormSection>
  );
};

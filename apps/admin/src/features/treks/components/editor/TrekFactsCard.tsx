import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../constants";
import type { TrekValues } from "../../types";

type TrekFactsCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

type TextFact = { name: "startFinish" | "dailyWalking" | "guideRatio" | "seasonLabel" | "accommodation" | "transport"; label: string; placeholder: string };

const TEXT_FACTS: TextFact[] = [
  { name: "startFinish", label: "Start / finish", placeholder: "Kathmandu / Syabrubesi" },
  { name: "dailyWalking", label: "Daily walking", placeholder: "5 to 7 hours a day" },
  { name: "guideRatio", label: "Guide to trekker", placeholder: "1 : 4 + porters" },
  { name: "seasonLabel", label: "Best season", placeholder: "Mar–May, Oct–Nov" },
  { name: "accommodation", label: "Accommodation", placeholder: "Teahouse and hotel" },
  { name: "transport", label: "Transport", placeholder: "Jeep to Syabrubesi" },
];

const numberText = (value: number | null) => (value === null ? "" : String(value));

/**
 * The trip facts under the photo on the trek page. Difficulty comes from the card above; "Country: Nepal"
 * and "Activity: Trekking / hiking" are the same on every trek.
 */
export const TrekFactsCard = ({ values, errors }: TrekFactsCardProps) => {
  // With a day-by-day plan, its length and highest point are used (set on Save), so they can't be typed here.
  const hasPlan = values.itinerary.length > 0;
  const fromPlan = hasPlan ? "From Day by day." : undefined;

  return (
    <FormSection title="Trip facts" hint="The boxes under the photo on the trek page. Days and the highest altitude also show on trek cards.">
      <div className="grid gap-3 tablet:grid-cols-3">
        <TextField
          name="days"
          label="Duration (days)"
          inputMode="numeric"
          placeholder="10"
          defaultValue={numberText(values.days)}
          error={errors.days}
          isReadOnly={hasPlan}
          hint={fromPlan}
        />
        <TextField
          name="maxAltitudeM"
          label="Max. altitude (m)"
          inputMode="numeric"
          placeholder="4,773"
          defaultValue={numberText(values.maxAltitudeM)}
          error={errors.maxAltitudeM}
          isReadOnly={hasPlan}
          hint={fromPlan}
        />
        <TextField
          name="distanceKm"
          label="Total distance (km)"
          inputMode="numeric"
          placeholder="75"
          defaultValue={numberText(values.distanceKm)}
          error={errors.distanceKm}
        />
      </div>
      <div className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {TEXT_FACTS.map((fact) => (
          <TextField
            key={fact.name}
            name={fact.name}
            label={fact.label}
            placeholder={fact.placeholder}
            defaultValue={values[fact.name]}
            error={errors[fact.name]}
            maxLength={LIMIT.fact}
          />
        ))}
      </div>
    </FormSection>
  );
};

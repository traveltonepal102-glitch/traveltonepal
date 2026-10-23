"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, tileLabelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../constants";
import type { RegionValues } from "../../types";

type FactKey = "highestPoint" | "trekLength" | "difficulty" | "gettingThere" | "permits";

const FACTS: { key: FactKey; label: string; icon: IconName; placeholder: string }[] = [
  { key: "highestPoint", label: "Highest point", icon: "altitude", placeholder: "4,984 m (Tserko Ri)" },
  { key: "trekLength", label: "Trek length", icon: "calendar_month", placeholder: "7–12 days" },
  { key: "difficulty", label: "Difficulty", icon: "speed", placeholder: "Moderate" },
  { key: "gettingThere", label: "Getting there", icon: "route", placeholder: "Drive" },
  { key: "permits", label: "Permits", icon: "description", placeholder: "Langtang NP + TIMS" },
];

type FactTileProps = {
  name: FactKey;
  label: string;
  icon: IconName;
  placeholder: string;
  defaultValue: string;
  error?: string;
};

const FactTile = ({ name, label, icon, placeholder, defaultValue, error }: FactTileProps) => {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-solid border-border bg-page p-2.5">
      <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
        <Icon name={icon} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <label htmlFor={id} className={tileLabelClass}>
          {label}
        </label>
        <input
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={LIMIT.fact}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass, "h-8 px-2 text-caption font-semibold")}
        />
        <FieldError id={`${id}-error`} message={error} />
      </span>
    </div>
  );
};

type FactsSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
};

/** Key facts shown on the region card and page (design: section "facts"). */
export const FactsSection = ({ values, errors }: FactsSectionProps) => (
  <FormSection title="Region facts" hint="The key facts about this region, shown on the region card and the region page.">
    <div className="grid gap-2.5 tablet:grid-cols-2 desktop:grid-cols-3">
      {FACTS.map((fact) => (
        <FactTile
          key={fact.key}
          name={fact.key}
          label={fact.label}
          icon={fact.icon}
          placeholder={fact.placeholder}
          defaultValue={values[fact.key]}
          error={errors[fact.key]}
        />
      ))}
    </div>
    <TextField
      name="gettingThereDetails"
      label="How to get there (longer)"
      placeholder="Drive to Syabrubesi (7–8 hrs)"
      defaultValue={values.gettingThereDetails}
      error={errors.gettingThereDetails}
      maxLength={LIMIT.factDetails}
    />
  </FormSection>
);

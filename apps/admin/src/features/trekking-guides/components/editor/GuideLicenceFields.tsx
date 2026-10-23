"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { FIRST_AID_OPTIONS, GUIDE_LIMITS as LIMIT } from "../../constants";
import { licenceStatus } from "../../lib/guideRules";
import type { LicenceStatus, TrekkingGuideValues } from "../../types";

type GuideLicenceFieldsProps = {
  values: TrekkingGuideValues;
  /** "YYYY-MM-DD" in Nepal, to tell an expired licence. */
  today: string;
  errors: FieldErrors;
};

const STATUS: Record<LicenceStatus, { label: string; icon: "verified" | "warning" | "info"; className: string }> = {
  valid: { label: "Licence checked: the website shows “Licensed”", icon: "verified", className: "bg-green-tint text-whatsapp" },
  expired: { label: "Licence expired: renew it, or the website won't show “Licensed”", icon: "warning", className: "bg-saffron-tint text-saffron-ink" },
  none: { label: "No licence number yet", icon: "info", className: "bg-page text-muted-foreground" },
};

/** Licence and first aid (design: guide only). The licence number stays in the admin; the website shows a badge. */
export const GuideLicenceFields = ({ values, today, errors }: GuideLicenceFieldsProps) => {
  const monthId = useId();
  const [licenceNumber, setLicenceNumber] = useState(values.licenceNumber);
  const [validUntil, setValidUntil] = useState(values.licenceValidUntil ?? "");
  const status = STATUS[licenceStatus({ licenceNumber, licenceValidUntil: validUntil || null }, today)];

  return (
    <>
      <div className="grid gap-3 tablet:grid-cols-2">
        <TextField
          name="licenceNumber"
          label="Guide licence number"
          hint="Only admins see it."
          value={licenceNumber}
          onValueChange={setLicenceNumber}
          maxLength={LIMIT.licenceNumber}
          error={errors.licenceNumber}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={monthId} className={labelClass}>
            Valid until
          </label>
          <input
            id={monthId}
            type="month"
            name="licenceValidUntil"
            value={validUntil}
            onChange={(event) => setValidUntil(event.target.value)}
            aria-invalid={errors.licenceValidUntil ? true : undefined}
            aria-describedby={errors.licenceValidUntil ? `${monthId}-error` : undefined}
            className={cn(inputClass, "cursor-pointer")}
          />
          <FieldError id={`${monthId}-error`} message={errors.licenceValidUntil} />
        </div>
      </div>
      <p className={cn("m-0 flex items-center gap-2 rounded-md px-3 py-2 text-caption font-semibold", status.className)}>
        <Icon name={status.icon} size={18} className="flex-none" />
        {status.label}
      </p>
      <SelectField name="firstAid" label="First aid training" options={FIRST_AID_OPTIONS} defaultValue={values.firstAid} error={errors.firstAid} />
    </>
  );
};

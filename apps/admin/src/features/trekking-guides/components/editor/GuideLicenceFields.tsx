"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FormGroup } from "@/components/editor/FormGroup";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { GUIDE_LIMITS as LIMIT } from "../../constants";
import { licenceStatus } from "../../lib/guideRules";
import type { LicenceStatus, TrekkingGuideValues } from "../../types";
import { CertificatesField } from "./CertificatesField";

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

/** "Licence and training". The licence number stays in the admin; the website shows the "licence checked" tick. */
export const GuideLicenceFields = ({ values, today, errors }: GuideLicenceFieldsProps) => {
  const monthId = useId();
  const [licenceNumber, setLicenceNumber] = useState(values.licenceNumber);
  const [validUntil, setValidUntil] = useState(values.licenceValidUntil ?? "");
  const licence = licenceStatus({ licenceNumber, licenceValidUntil: validUntil || null }, today);
  const status = STATUS[licence];

  return (
    <FormGroup title="Licence and training">
      <div className="grid gap-3 tablet:grid-cols-2">
        <TextField
          name="licenceNumber"
          label="Trekking guide licence no."
          hint="Kept private: only admins see it."
          value={licenceNumber}
          onValueChange={setLicenceNumber}
          maxLength={LIMIT.licenceNumber}
          error={errors.licenceNumber}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={monthId} className={labelClass}>
            Licence valid until
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
      <span className="text-xs text-muted-foreground">Issued by Nepal’s Department of Tourism. The website only shows the blue “licence checked” tick.</span>
      <CertificatesField values={values} isLicensed={licence === "valid"} today={today} errors={errors} />
    </FormGroup>
  );
};

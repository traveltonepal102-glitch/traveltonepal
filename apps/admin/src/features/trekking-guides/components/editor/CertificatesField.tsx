"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { GUIDE_CERTIFICATES, LICENCE_LABEL } from "../../constants";
import { isValidThrough } from "../../lib/guideRules";
import type { GuideCertificate, TrekkingGuideValues } from "../../types";

type CertificatesFieldProps = {
  values: TrekkingGuideValues;
  /** Whether the licence above counts as checked (ticks the licence line by itself). */
  isLicensed: boolean;
  /** "YYYY-MM-DD" in Nepal, to tell an expired certificate. */
  today: string;
  errors: FieldErrors;
};

const END_MONTH_FIELD = { wfr: "wfrValidUntil", first_aid: "firstAidValidUntil" } as const;

/**
 * "Training and certificates": each ticked one is sent as `certificate`, WFR and first aid with the month they
 * run out. The card's "Cert:" line lists the current ones; the highest is the green badge on the photo.
 */
export const CertificatesField = ({ values, isLicensed, today, errors }: CertificatesFieldProps) => {
  const id = useId();
  const [ticked, setTicked] = useState(() => new Set(values.certificates));

  const toggle = (certificate: GuideCertificate, isOn: boolean) =>
    setTicked((current) => {
      const next = new Set(current);
      if (isOn) next.add(certificate);
      else next.delete(certificate);
      return next;
    });

  return (
    <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
      <legend className={cn(labelClass, "mb-1.5 p-0")}>Training and certificates</legend>
      <div className={cn("flex items-center gap-2.5 rounded-lg border border-solid px-3 py-2", isLicensed ? "border-brand-tint bg-page" : "border-border")}>
        <Icon name={isLicensed ? "verified" : "radio_button_unchecked"} size={20} className={cn("flex-none", isLicensed ? "text-brand" : "text-subtle")} />
        <span className="min-w-0 flex-1 text-body-sm font-semibold text-ink">
          {LICENCE_LABEL.label}
          <span className="block text-xs font-medium text-muted-foreground">Ticked by itself while the licence above is valid.</span>
        </span>
      </div>
      {GUIDE_CERTIFICATES.map((certificate) => {
        const isOn = ticked.has(certificate.value);
        const monthField = certificate.hasEndMonth ? END_MONTH_FIELD[certificate.value as keyof typeof END_MONTH_FIELD] : null;
        const month = monthField ? values[monthField] : null;
        return (
          <div key={certificate.value} className={cn("flex flex-wrap items-center gap-2.5 rounded-lg border border-solid px-3 py-2", isOn ? "border-brand-tint bg-page" : "border-border")}>
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-body-sm font-semibold text-ink">
              <input
                type="checkbox"
                name="certificate"
                value={certificate.value}
                checked={isOn}
                onChange={(event) => toggle(certificate.value, event.target.checked)}
                className="size-4.5 flex-none accent-brand"
              />
              {certificate.label}
            </label>
            {isOn && monthField && (
              <span className="flex items-center gap-2">
                {month && !isValidThrough(month, today) && <span className="text-xs font-bold text-saffron-ink">Expired</span>}
                <label className="sr-only" htmlFor={`${id}-${monthField}`}>
                  {certificate.label} valid until
                </label>
                <input
                  id={`${id}-${monthField}`}
                  type="month"
                  name={monthField}
                  defaultValue={month ?? ""}
                  title="Valid until"
                  aria-invalid={errors[monthField] ? true : undefined}
                  className={cn(inputClass, "h-9 w-40 cursor-pointer text-caption")}
                />
              </span>
            )}
          </div>
        );
      })}
      <FieldError id={`${id}-wfr-error`} message={errors.wfrValidUntil ?? errors.firstAidValidUntil ?? errors.certificates} />
      <span className="text-xs text-muted-foreground">
        Ticked items make the card’s “Cert:” line. The highest one shows as the green badge on the photo: WFR, then first aid, then the licence. An expired one no longer shows.
      </span>
    </fieldset>
  );
};

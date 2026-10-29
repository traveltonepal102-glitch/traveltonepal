"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { CanonicalPathField } from "@/components/editor/CanonicalPathField";
import { FormSection } from "@/components/ui/FormSection";
import { SharePhotoField } from "@/features/photos/components/SharePhotoField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import { getSeoChecks } from "../../../lib/seoChecks";
import type { TrekValues } from "../../../types";
import { GooglePreview } from "./GooglePreview";

type GoogleSearchCardProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * How the trek shows on Google (design: "Google search result") and in shared links. Not shown on the page itself. The preview and the
 * checklist follow what is typed here; the web address, prices and questions are as last saved.
 */
export const GoogleSearchCard = ({ values, errors, onEdit }: GoogleSearchCardProps) => {
  const [seoKeyword, setKeyword] = useState(values.seoKeyword);
  const [seoTitle, setTitle] = useState(values.seoTitle);
  const [seoDescription, setDescription] = useState(values.seoDescription);
  const checks = getSeoChecks({ ...values, seoKeyword, seoTitle, seoDescription });
  const done = checks.filter((check) => check.isDone).length;
  const priceFromUsd = values.groupPrices.find((price) => price.isDefault)?.priceUsd ?? null;

  return (
    <FormSection
      title="How the trek shows on Google"
      aside={
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", done === checks.length ? "bg-green-tint text-whatsapp" : "bg-saffron-tint text-saffron-ink")}>
          {done} of {checks.length} done
        </span>
      }
    >
      <div className="grid gap-5 desktop:grid-cols-2">
        <div className="flex flex-col gap-3">
          <TextField
            name="seoKeyword"
            label="Main keyword"
            hint="What people type into Google to find this trek. Only used for the checks below."
            value={seoKeyword}
            onValueChange={setKeyword}
            placeholder="langtang valley trek"
            maxLength={LIMIT.seoKeyword}
            error={errors.seoKeyword}
          />
          <TextField
            name="seoTitle"
            label="Google title"
            hint="Not the same as the big heading on the page. This one is only shown on Google."
            value={seoTitle}
            onValueChange={setTitle}
            placeholder="Langtang Valley Trek: 10 Days from $890 | Local Guides"
            maxLength={LIMIT.seoTitle}
            recommendedLength={LIMIT.seoTitleRecommended}
            showCount
            error={errors.seoTitle}
          />
          <TextField
            name="seoDescription"
            label="Google description"
            multiline
            rows={4}
            value={seoDescription}
            onValueChange={setDescription}
            placeholder="10-day Langtang Valley Trek from Kathmandu, no flights. Local guides, teahouse stays, Kyanjin Ri at 4,773 m."
            maxLength={LIMIT.seoDescription}
            recommendedLength={LIMIT.seoDescriptionRecommended}
            showCount
            error={errors.seoDescription}
          />
          <CanonicalPathField defaultValue={values.canonicalPath} error={errors.canonicalPath} />
          <SharePhotoField initial={values.sharePhoto} fallback="the trek's first photo" onEdit={onEdit} />
        </div>
        <div className="flex flex-col gap-3">
          <GooglePreview slug={values.slug} title={seoTitle} description={seoDescription} priceFromUsd={priceFromUsd} />
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-caption">
                <Icon name={check.isDone ? "check_circle" : "radio_button_unchecked"} size={18} className={cn("flex-none", check.isDone ? "text-whatsapp" : "text-subtle")} />
                <span className={check.isDone ? "text-ink" : "text-muted-foreground"}>{check.label}</span>
                <span className="sr-only">{check.isDone ? "(done)" : "(not yet)"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FormSection>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { CanonicalPathField } from "@/components/editor/CanonicalPathField";
import { HideFromGoogleField } from "@/components/editor/HideFromGoogleField";
import { FormSection } from "@/components/ui/FormSection";
import { tileLabelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { SharePhotoField } from "@/features/photos/components/SharePhotoField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS, SEO_DESCRIPTION_RECOMMENDED, SEO_TITLE_RECOMMENDED } from "../../constants";
import type { RegionValues } from "../../types";

type SeoSectionProps = {
  values: RegionValues;
  errors: FieldErrors;
  /** The web address as typed in Basics, for the preview. */
  slug: string;
  onEdit: () => void;
};

/** Google title and description with a live preview and checks (design: section "seo"), and the shared links' photo. */
export const SeoSection = ({ values, errors, slug, onEdit }: SeoSectionProps) => {
  const [keyword, setKeyword] = useState(values.seoKeyword);
  const [title, setTitle] = useState(values.seoTitle);
  const [description, setDescription] = useState(values.seoDescription);

  const checks = [
    { label: "Main keyword in the title", isMet: Boolean(keyword.trim()) && title.toLowerCase().includes(keyword.trim().toLowerCase()) },
    { label: `Title ${SEO_TITLE_RECOMMENDED} characters or fewer`, isMet: Boolean(title) && title.length <= SEO_TITLE_RECOMMENDED },
    {
      label: `Description ${SEO_DESCRIPTION_RECOMMENDED} characters or fewer`,
      isMet: Boolean(description) && description.length <= SEO_DESCRIPTION_RECOMMENDED,
    },
  ];
  const metCount = checks.filter((check) => check.isMet).length;

  return (
    <FormSection
      title="How the region shows on Google"
      aside={
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap",
            metCount === checks.length ? "bg-green-tint text-whatsapp" : "bg-saffron-tint text-saffron-ink",
          )}
        >
          {metCount} of {checks.length} done
        </span>
      }
    >
      <div className="grid gap-4 desktop:grid-cols-2">
        <div className="flex flex-col gap-3">
          <TextField name="seoKeyword" label="Main keyword" value={keyword} onValueChange={setKeyword} error={errors.seoKeyword} maxLength={REGION_LIMITS.seoKeyword} />
          <TextField
            name="seoTitle"
            label="Google title"
            value={title}
            onValueChange={setTitle}
            error={errors.seoTitle}
            maxLength={REGION_LIMITS.seoTitle}
            recommendedLength={SEO_TITLE_RECOMMENDED}
            showCount
          />
          <TextField
            name="seoDescription"
            label="Google description"
            multiline
            value={description}
            onValueChange={setDescription}
            error={errors.seoDescription}
            maxLength={REGION_LIMITS.seoDescription}
            recommendedLength={SEO_DESCRIPTION_RECOMMENDED}
            showCount
          />
          <CanonicalPathField defaultValue={values.canonicalPath} error={errors.canonicalPath} />
          <HideFromGoogleField defaultChecked={values.hideFromGoogle} />
          <SharePhotoField initial={values.sharePhoto} fallback="the region's cover photo" onEdit={onEdit} />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5 rounded-xl border border-solid border-border p-3.5">
            <span className={cn(tileLabelClass, "mb-1")}>Google preview</span>
            <span className="text-xs text-[#202124]">traveltonepal.com › regions › {slug || "…"}</span>
            <span className="text-[17px] leading-snug text-[#1a0dab]">{title || values.name || "Your Google title"}</span>
            <span className="text-caption text-[#4d5156]">{description || "Your Google description shows here."}</span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-caption">
                <Icon
                  name={check.isMet ? "check_circle" : "radio_button_unchecked"}
                  size={18}
                  label={check.isMet ? "Done" : "Not yet"}
                  className={check.isMet ? "text-whatsapp" : "text-subtle"}
                />
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FormSection>
  );
};

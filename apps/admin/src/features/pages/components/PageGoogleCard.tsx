"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { CanonicalPathField } from "@/components/editor/CanonicalPathField";
import { FormSection } from "@/components/ui/FormSection";
import { tileLabelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { SharePhotoField } from "@/features/photos/components/SharePhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT, SEO_DESCRIPTION_RECOMMENDED, SEO_TITLE_RECOMMENDED } from "../constants";
import type { PageTopValues } from "../types";

type PageGoogleCardProps = {
  values: PageTopValues;
  errors: FieldErrors;
  /** The page's address on the website, e.g. "/about", for the preview. */
  websitePath: string;
  /** Before each field's name when one form holds several pages ("home." → "home.seoTitle"). */
  fieldPrefix?: string;
  /** Under the card's title, e.g. how {regions} works. */
  hint?: string;
  /** The saved photo of the page's shared links. */
  sharePhoto: Photo | null;
  /** What shared links show without one, e.g. "the photo behind the heading". */
  shareFallback: string;
  onEdit: () => void;
};

/** What the website adds after every page's title (the root layout's title template). */
const TITLE_SUFFIX = " · Travel To Nepal";

/**
 * How the page shows on Google: main keyword, title and description, with a preview and checks. A blank title or
 * description uses the main heading and the text under it. Also the photo of the page's shared links.
 */
export const PageGoogleCard = ({ values, errors, websitePath, fieldPrefix = "", hint, sharePhoto, shareFallback, onEdit }: PageGoogleCardProps) => {
  const name = (field: string) => `${fieldPrefix}${field}`;
  const [keyword, setKeyword] = useState(values.seoKeyword);
  const [title, setTitle] = useState(values.seoTitle);
  const [description, setDescription] = useState(values.seoDescription);
  const shownTitle = `${title.trim() || values.heading}${TITLE_SUFFIX}`;
  const shownDescription = description.trim() || values.intro;

  const checks = [
    { label: "Main keyword in the title", isMet: Boolean(keyword.trim()) && shownTitle.toLowerCase().includes(keyword.trim().toLowerCase()) },
    { label: `Title ${SEO_TITLE_RECOMMENDED} characters or fewer, with “${TITLE_SUFFIX.trim()}”`, isMet: shownTitle.length > TITLE_SUFFIX.length && shownTitle.length <= SEO_TITLE_RECOMMENDED },
    { label: `Description ${SEO_DESCRIPTION_RECOMMENDED} characters or fewer`, isMet: Boolean(shownDescription) && shownDescription.length <= SEO_DESCRIPTION_RECOMMENDED },
  ];
  const metCount = checks.filter((check) => check.isMet).length;

  return (
    <FormSection
      title="How the page shows on Google"
      hint={hint}
      aside={
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", metCount === checks.length ? "bg-green-tint text-whatsapp" : "bg-saffron-tint text-saffron-ink")}>
          {metCount} of {checks.length} done
        </span>
      }
    >
      <div className="grid gap-4 desktop:grid-cols-2">
        <div className="flex flex-col gap-3">
          <TextField name={name("seoKeyword")} label="Main keyword" hint="What people type into Google to find this page." value={keyword} onValueChange={setKeyword} maxLength={LIMIT.seoKeyword} error={errors[name("seoKeyword")]} />
          <TextField
            name={name("seoTitle")}
            label="Google title"
            hint={`The website adds “${TITLE_SUFFIX.trim()}” after it.`}
            value={title}
            onValueChange={setTitle}
            maxLength={LIMIT.seoTitle}
            recommendedLength={SEO_TITLE_RECOMMENDED - TITLE_SUFFIX.length}
            showCount
            error={errors[name("seoTitle")]}
          />
          <TextField
            name={name("seoDescription")}
            label="Google description"
            multiline
            value={description}
            onValueChange={setDescription}
            maxLength={LIMIT.seoDescription}
            recommendedLength={SEO_DESCRIPTION_RECOMMENDED}
            showCount
            error={errors[name("seoDescription")]}
          />
          <CanonicalPathField name={name("canonicalPath")} defaultValue={values.canonicalPath} error={errors[name("canonicalPath")]} />
          <SharePhotoField name={name("sharePhotoId")} initial={sharePhoto} fallback={shareFallback} onEdit={onEdit} />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5 rounded-xl border border-solid border-border p-3.5">
            <span className={cn(tileLabelClass, "mb-1")}>Google preview</span>
            <span className="text-xs text-[#202124]">traveltonepal.com › {websitePath.replace(/^\//, "") || "home"}</span>
            <span className="text-[17px] leading-snug text-[#1a0dab]">{shownTitle}</span>
            <span className="line-clamp-2 text-caption text-[#4d5156]">{shownDescription || "Your Google description shows here."}</span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-caption">
                <Icon name={check.isMet ? "check_circle" : "radio_button_unchecked"} size={18} label={check.isMet ? "Done" : "Not yet"} className={check.isMet ? "text-whatsapp" : "text-subtle"} />
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FormSection>
  );
};

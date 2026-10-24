"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { SelectField } from "@/components/ui/SelectField";
import { SlugField } from "@/components/ui/SlugField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { formatCalendarDate } from "@/utils/formatDateTime";
import { slugify } from "@/utils/slugify";

import { ARTICLE_TOPICS } from "../../../constants";
import type { Article, ArticleOptions, ArticleValues, PublishMode } from "../../../types";

type PublishingCardProps = {
  values: ArticleValues;
  /** The saved guide (null for a new one), for its dates. */
  article: Article | null;
  sites: ArticleOptions["sites"];
  /** The website and title as typed now. */
  siteRegionId: string | null;
  title: string;
  errors: FieldErrors;
};

const MAIN_SITE = "traveltonepal.com";

const PUBLISH_MODES: { value: PublishMode; label: string }[] = [
  { value: "now", label: "As soon as I set it to Published" },
  { value: "date", label: "On a date I choose" },
];

/** "Publishing": the website, topic, web address, when it goes live, and its dates. */
export const PublishingCard = ({ values, article, sites, siteRegionId, title, errors }: PublishingCardProps) => {
  const id = useId();
  const [mode, setMode] = useState(values.publishMode);
  const [slug, setSlug] = useState(values.slug);
  const [isSlugTyped, setIsSlugTyped] = useState(Boolean(article));
  const site = sites.find((item) => item.id === siteRegionId);
  const shownSlug = isSlugTyped ? slug : slugify(title);

  return (
    <FormSection title="Publishing">
      <SelectField
        name="siteRegionId"
        label="Website"
        options={[{ value: "", label: "Travel To Nepal (main)" }, ...sites.map((item) => ({ value: item.id, label: item.name }))]}
        defaultValue={values.siteRegionId ?? ""}
        error={errors.siteRegionId}
      />
      {site && (
        <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-ink">
          <input type="checkbox" name="alsoOnMainSite" defaultChecked={values.alsoOnMainSite} className="mt-0.5 size-4.5 flex-none accent-brand" />
          <span>
            Also show on the main site ({MAIN_SITE})
            <span className="block text-xs text-muted-foreground">
              The main-site copy tells Google the {site.name} site has the original (canonical), so the two don’t compete.
            </span>
          </span>
        </label>
      )}
      <SelectField
        name="topic"
        label="Topic"
        hint="Also the tag on the photo and the last step of the breadcrumb."
        options={ARTICLE_TOPICS}
        defaultValue={values.topic}
        error={errors.topic}
      />
      <SlugField
        label="Web address"
        prefix={`${site?.domain ?? MAIN_SITE}/guides/`}
        value={shownSlug}
        onChange={(next) => {
          setIsSlugTyped(true);
          setSlug(next);
        }}
        hint={article ? "Changing it moves the guide to a new address." : "Made from the title. Lowercase letters, numbers and dashes."}
        error={errors.slug}
      />
      <SelectField
        name="publishMode"
        label="Goes live"
        options={PUBLISH_MODES}
        defaultValue={mode}
        onValueChange={(next) => setMode(next === "date" ? "date" : "now")}
        error={errors.publishMode}
      />
      {mode === "date" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-date`} className={labelClass}>
            Date it goes live <span className="font-medium text-muted-foreground">(Nepal date)</span>
          </label>
          <input
            id={`${id}-date`}
            type="date"
            name="publishedOn"
            defaultValue={values.publishedOn ?? ""}
            aria-invalid={errors.publishedOn ? true : undefined}
            aria-describedby={errors.publishedOn ? `${id}-date-error` : undefined}
            className={cn(inputClass, "cursor-pointer")}
          />
          <span className="text-xs text-muted-foreground">Set the status to Published: it shows on the website from that day.</span>
          <FieldError id={`${id}-date-error`} message={errors.publishedOn} />
        </div>
      )}
      <div className="flex flex-col gap-1.5 rounded-lg border border-solid border-border bg-page px-3 py-2.5 text-caption">
        <span className="flex justify-between gap-2">
          <span className="text-muted-foreground">First published</span>
          <strong className="text-ink">{article?.status === "published" && article.publishedOn ? formatCalendarDate(article.publishedOn) : "Not yet"}</strong>
        </span>
        <span className="flex justify-between gap-2">
          <span className="text-muted-foreground">Last big update</span>
          <strong className="text-ink">{article?.updatedOn ? formatCalendarDate(article.updatedOn) : "None yet"}</strong>
        </span>
        {article?.status === "published" && (
          <label className="flex cursor-pointer items-start gap-2 pt-1 text-ink">
            <input type="checkbox" name="isBigUpdate" className="mt-0.5 size-4.5 flex-none accent-brand" />
            <span>
              This is a big update
              <span className="block text-xs text-muted-foreground">Changes the date Google sees. Leave off for small fixes.</span>
            </span>
          </label>
        )}
      </div>
    </FormSection>
  );
};

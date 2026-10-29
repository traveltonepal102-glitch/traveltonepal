import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { SharePhotoField } from "@/features/photos/components/SharePhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { ARTICLE_LIMITS as LIMIT } from "../../../constants";
import type { SeoCheck } from "../../../lib/articleSeoChecks";
import type { ArticleDraft } from "../../../lib/articleDraft";
import type { ArticleValues } from "../../../types";

type ArticleSeoCardProps = {
  values: ArticleValues;
  draft: ArticleDraft;
  /** e.g. "traveltonepal.com" or the region site's domain. */
  domain: string;
  checks: SeoCheck[];
  errors: FieldErrors;
  sharePhoto: Photo | null;
  onEdit: () => void;
};

/** "Google (SEO)": the keyword, Google title and description, a preview of the result, the checklist and the shared links' photo. */
export const ArticleSeoCard = ({ values, draft, domain, checks, errors, sharePhoto, onEdit }: ArticleSeoCardProps) => {
  const done = checks.filter((check) => check.isDone).length;

  return (
    <FormSection
      title="Google (SEO)"
      aside={
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", done === checks.length ? "bg-green-tint text-whatsapp" : "bg-saffron-tint text-saffron-ink")}>
          {done} of {checks.length} done
        </span>
      }
    >
      <TextField
        name="seoKeyword"
        label="Main keyword"
        hint="What people type into Google. Only used for the checks below."
        defaultValue={values.seoKeyword}
        placeholder="best time to trek langtang"
        maxLength={LIMIT.seoKeyword}
        error={errors.seoKeyword}
      />
      <TextField
        name="seoTitle"
        label="Google title"
        defaultValue={values.seoTitle}
        placeholder="Best Time to Trek Langtang (Month by Month) | 2026"
        maxLength={LIMIT.seoTitle}
        recommendedLength={LIMIT.seoTitleRecommended}
        showCount
        error={errors.seoTitle}
      />
      <TextField
        name="seoDescription"
        label="Google description"
        multiline
        rows={3}
        defaultValue={values.seoDescription}
        maxLength={LIMIT.seoDescription}
        recommendedLength={LIMIT.seoDescriptionRecommended}
        showCount
        error={errors.seoDescription}
      />
      <div className="flex flex-col gap-0.5 rounded-lg border border-solid border-border bg-surface p-3 font-[Arial,sans-serif]">
        <span className="mb-1 font-sans text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Google preview</span>
        <span className="truncate text-xs text-[#202124]">{domain} › guides</span>
        <span className="line-clamp-2 text-base leading-snug text-[#1a0dab]">{draft.seoTitle || draft.title || "Your Google title"}</span>
        <span className="line-clamp-2 text-xs leading-normal text-[#4d5156]">{draft.seoDescription || "Your Google description."}</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2 text-caption">
            <Icon name={check.isDone ? "check_circle" : "radio_button_unchecked"} size={18} className={cn("flex-none", check.isDone ? "text-whatsapp" : "text-subtle")} />
            <span className={check.isDone ? "text-ink" : "text-muted-foreground"}>{check.label}</span>
            <span className="sr-only">{check.isDone ? "(done)" : "(not yet)"}</span>
          </li>
        ))}
      </ul>
      <SharePhotoField initial={sharePhoto} fallback="the guide's photo" onEdit={onEdit} />
    </FormSection>
  );
};

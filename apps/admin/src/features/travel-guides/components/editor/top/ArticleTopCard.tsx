import { Icon } from "@ttn/ui/icon";

import { FormSection } from "@/components/ui/FormSection";
import { labelClass } from "@/components/ui/formStyles";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { ARTICLE_LIMITS as LIMIT, ARTICLE_TOPICS } from "../../../constants";
import type { ArticleDraft } from "../../../lib/articleDraft";
import type { ArticleOptions, ArticleValues } from "../../../types";
import { ArticleCoverField } from "./ArticleCoverField";
import { KeyFactsField } from "./KeyFactsField";

type ArticleTopCardProps = {
  values: ArticleValues;
  draft: ArticleDraft;
  cover: Photo | null;
  /** Counted from the intro and the article body as typed. */
  readMinutes: number;
  treks: ArticleOptions["treks"];
  errors: FieldErrors;
  onEdit: () => void;
  onCoverChange: (cover: Photo | null) => void;
};

/** "Top of the page" (always first): the photo and its tags, the title, intro, card text and key facts. */
export const ArticleTopCard = ({ values, draft, cover, readMinutes, treks, errors, onEdit, onCoverChange }: ArticleTopCardProps) => {
  const photoTrek = treks.find((trek) => trek.id === draft.photoTrekId);
  const mainTrek = treks.find((trek) => trek.id === draft.mainTrekId);
  const tags = [
    ...(photoTrek ? [{ label: photoTrek.name, tone: "trek" as const }] : []),
    { label: ARTICLE_TOPICS.find((topic) => topic.value === draft.topic)?.label ?? "", tone: "auto" as const },
    ...(mainTrek?.maxAltitudeM ? [{ label: `Max ${mainTrek.maxAltitudeM.toLocaleString("en")} m`, tone: "auto" as const }] : []),
    ...(draft.highlightTag ? [{ label: draft.highlightTag, tone: "highlight" as const }] : []),
  ];

  return (
    <FormSection title="Top of the page" aside={<span className="text-xs text-muted-foreground">Always first</span>}>
      <ArticleCoverField cover={cover} regionId={draft.siteRegionId} tags={tags} error={errors.coverPhotoId} onChange={onCoverChange} />
      <TextField
        name="coverAlt"
        label="Photo description"
        labelNote="(for Google and screen readers)"
        defaultValue={values.coverAlt}
        placeholder="Snow peaks and the Langtang glacier above Kyanjin Gompa on a clear autumn day"
        maxLength={LIMIT.coverAlt}
        error={errors.coverAlt}
      />
      <TextField
        name="title"
        label="Title · H1"
        defaultValue={values.title}
        placeholder="Best Time to Trek Langtang: A Month-by-Month Guide"
        maxLength={LIMIT.title}
        recommendedLength={LIMIT.titleRecommended}
        showCount
        error={errors.title}
        inputClassName="h-14 font-display text-2xl font-extrabold"
      />
      <TextField
        name="intro"
        label="Intro"
        labelNote="(1–2 sentences under the title)"
        multiline
        rows={2}
        defaultValue={values.intro}
        maxLength={LIMIT.intro}
        error={errors.intro}
      />
      <TextField
        name="cardText"
        label="Card text"
        hint="One short line on the Travel guides page and in “Related guides” cards."
        defaultValue={values.cardText}
        maxLength={LIMIT.cardText}
        showCount
        error={errors.cardText}
      />
      <div className="grid gap-3 tablet:grid-cols-2">
        <SelectField
          name="photoTrekId"
          label="Trek tag on the photo"
          options={[...treks.map((trek) => ({ value: trek.id, label: trek.name })), { value: "", label: "No trek tag" }]}
          defaultValue={values.photoTrekId ?? ""}
          error={errors.photoTrekId}
        />
        <TextField
          name="highlightTag"
          label="Green highlight tag"
          defaultValue={values.highlightTag}
          placeholder="Best: Oct–Nov & Mar–May"
          maxLength={LIMIT.highlightTag}
          error={errors.highlightTag}
        />
        <TextField
          name="updatedLine"
          label="Line next to the read time"
          hint="e.g. “Updated for the 2026 season”."
          defaultValue={values.updatedLine}
          maxLength={LIMIT.updatedLine}
          error={errors.updatedLine}
        />
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Read time</span>
          <span className="flex h-10.5 items-center gap-2 rounded-md border border-dashed border-line-strong bg-page px-3 text-caption font-semibold text-text">
            <Icon name="schedule" size={18} className="text-muted-foreground" />
            {readMinutes} min read · counted from the text
          </span>
        </div>
      </div>
      <KeyFactsField facts={values.facts} errors={errors} onEdit={onEdit} />
    </FormSection>
  );
};

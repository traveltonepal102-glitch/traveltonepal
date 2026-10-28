"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { StatusSelect } from "@/components/editor/StatusSelect";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import type { Photo } from "@/features/photos/types";
import { useRowList } from "@/hooks/useRowList";

import { ARTICLE_STATUSES, TRAVEL_GUIDES_PATH } from "../../constants";
import { draftFromArticleForm } from "../../lib/articleDraft";
import type { ArticleDraft } from "../../lib/articleDraft";
import { getArticleSeoChecks } from "../../lib/articleSeoChecks";
import { readMinutes } from "../../lib/readTime";
import type { EditorSection } from "../../lib/sectionDrafts";
import { toEditorSection } from "../../lib/sectionDrafts";
import type { GuideFeedbackTotals } from "../../lib/guideFeedback";
import type { Article, ArticleOptions, ArticleValues } from "../../types";
import { ArticleBody } from "./body/ArticleBody";
import { ArticleSeoCard } from "./settings/ArticleSeoCard";
import { GuidesPageCard } from "./settings/GuidesPageCard";
import { LinksCard } from "./settings/LinksCard";
import { PeopleCard } from "./settings/PeopleCard";
import { PublishingCard } from "./settings/PublishingCard";
import { ReaderFeedbackCard } from "./settings/ReaderFeedbackCard";
import { ArticleTopCard } from "./top/ArticleTopCard";

type ArticleEditorProps = {
  /** saveArticle bound to this guide's id (null for a new guide). */
  action: EditorSaveAction;
  /** The saved guide; null for a new one. */
  article: Article | null;
  values: ArticleValues;
  options: ArticleOptions;
  /** Readers' "Was this guide helpful?" answers; null without votes (and for a new guide). */
  feedback?: GuideFeedbackTotals | null;
  lastSaved?: string;
  isJustAdded?: boolean;
};

/**
 * Add or edit a travel guide (design: Admin-article-editor): "Top of the page" and the article body on the
 * left, the settings on the right (below on phones). One form: Save sends everything, including the status.
 */
export const ArticleEditor = ({ action, article, values, options, feedback = null, lastSaved, isJustAdded = false }: ArticleEditorProps) => {
  const form = useEditorForm<"article">({
    action,
    firstKey: "article",
    firstSectionWithError: () => undefined,
    isNew: !article,
    lastSaved,
    addedLabel: isJustAdded ? "Travel guide added" : undefined,
  });
  const { errors, markDirty } = form;
  const [status, statusTone] = form.saveStatus;
  const [draft, setDraft] = useState<ArticleDraft>(values);
  const [cover, setCover] = useState(article?.cover ?? null);
  const [initialSections] = useState(() => values.sections.map(toEditorSection));
  const sections = useRowList<EditorSection>(initialSections, markDirty);
  const [months, setMonths] = useState(values.months);
  /** Photos uploaded in this editor, shown first in the library. */
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const site = options.sites.find((item) => item.id === draft.siteRegionId);

  const changeCover = (next: typeof cover) => {
    setCover(next);
    markDirty();
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      onChange={(event) => {
        markDirty();
        const fields = draftFromArticleForm(new FormData(event.currentTarget));
        setDraft((current) => ({ ...current, ...fields }));
      }}
      className="flex flex-col gap-5"
    >
      <EditorHeader
        back={{ href: TRAVEL_GUIDES_PATH, label: "Travel guides" }}
        title={article ? article.title : "New travel guide"}
        status={status}
        statusTone={statusTone}
        saveLabel={article ? "Save changes" : "Add travel guide"}
        isSaving={form.isSaving}
      >
        <StatusSelect options={ARTICLE_STATUSES} defaultValue={values.status} />
      </EditorHeader>
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-5 desktop:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          <ArticleTopCard
            values={values}
            draft={draft}
            cover={cover}
            readMinutes={readMinutes({ intro: draft.intro, sections: sections.rows })}
            treks={options.treks}
            errors={errors}
            onEdit={markDirty}
            onCoverChange={changeCover}
          />
          <ArticleBody
            sections={sections}
            context={{
              treks: options.treks,
              guides: options.guides,
              photos: [...uploadedPhotos, ...options.photos],
              addPhoto: (photo) => setUploadedPhotos((current) => [photo, ...current]),
              region: site ? { id: site.id, name: site.name } : null,
              months,
              onMonthsChange: (next) => {
                setMonths(next);
                markDirty();
              },
            }}
            errors={errors}
          />
        </div>

        <aside aria-label="Travel guide settings" className="flex min-w-0 flex-col gap-4">
          <PublishingCard values={values} article={article} sites={options.sites} siteRegionId={draft.siteRegionId} title={draft.title} errors={errors} />
          <GuidesPageCard values={values} errors={errors} />
          <PeopleCard values={values} authors={options.authors} checkers={options.checkers} errors={errors} />
          <LinksCard values={values} options={options} errors={errors} onEdit={markDirty} />
          <section className="flex flex-col gap-1.5 rounded-lg border border-solid border-border bg-page p-4">
            <span className="flex items-center gap-1.5 text-caption font-bold text-ink">
              <Icon name="info" size={18} className="text-brand" />
              Added to every guide by itself
            </span>
            <span className="text-xs text-muted-foreground">
              “In this guide” contents, read time, share buttons, Save as PDF, author box with “Checked by”, “Was this guide helpful?”, and the “Plan this trek” box from the main trek.
            </span>
          </section>
          <ArticleSeoCard
            values={values}
            draft={draft}
            domain={site?.domain ?? "traveltonepal.com"}
            checks={getArticleSeoChecks({ ...draft, hasCover: cover !== null, sections: sections.rows })}
            errors={errors}
          />
          {article && <ReaderFeedbackCard feedback={feedback} />}
        </aside>
      </div>
    </form>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { ArticleStatusLine } from "@/features/travel-guides/components/ArticleStatusLine";
import { ARTICLE_TOPICS, NEW_ARTICLE_PATH } from "@/features/travel-guides/constants";
import type { RegionArticleItem } from "@/features/travel-guides/lib/articleListItem";

import { MAX_PINNED_ARTICLES } from "../../constants";
import { listedPins, togglePin } from "../../lib/articlePins";

type RegionArticlesSectionProps = {
  regionName: string;
  /** Every travel guide about this region, most recently edited first. */
  articles: RegionArticleItem[];
  /** The saved pins, in order. */
  pinnedArticleIds: string[];
  /** "YYYY-MM-DD" in Nepal, for "Goes live …". */
  today: string;
  onEdit: () => void;
};

const topicLabel = (article: RegionArticleItem) => ARTICLE_TOPICS.find((topic) => topic.value === article.topic)?.label ?? "";

/**
 * "Before you go to …" on the region page (design: section "articles"): every travel guide with this region
 * ticked in its settings, and up to 3 pinned to show first. Sent as pinnedArticleId, in pin order.
 */
export const RegionArticlesSection = ({ regionName, articles, pinnedArticleIds, today, onEdit }: RegionArticlesSectionProps) => {
  const [pins, setPins] = useState(() => listedPins(pinnedArticleIds, articles.map((article) => article.id)));
  const name = regionName.trim() || "this region";
  const isFull = pins.length >= MAX_PINNED_ARTICLES;

  const pin = (articleId: string) => {
    setPins((current) => togglePin(current, articleId));
    onEdit();
  };

  return (
    <FormSection
      title={`Travel guides about ${name}`}
      hint={`Every travel guide with the region “${name}” ticked in its settings. Pin up to ${MAX_PINNED_ARTICLES} to show first on the region page (${pins.length} of ${MAX_PINNED_ARTICLES} pinned).`}
      aside={
        <Link href={NEW_ARTICLE_PATH} className={cn(secondaryButton, "flex-none")}>
          <Icon name="add" size={16} />
          Write a new guide
        </Link>
      }
    >
      {pins.map((id) => (
        <input key={id} type="hidden" name="pinnedArticleId" value={id} />
      ))}

      {articles.length ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {articles.map((article) => {
            const isPinned = pins.includes(article.id);
            const title = article.title.trim() || "Untitled guide";
            return (
              <li
                key={article.id}
                className={cn("flex items-center gap-3 rounded-lg border border-solid px-3 py-2.5", isPinned ? "border-saffron-line bg-saffron-tint/40" : "border-border bg-surface")}
              >
                <span className="inline-flex h-11.5 w-16 flex-none items-center justify-center overflow-hidden rounded-md bg-page text-subtle">
                  {article.cover ? <PhotoImage photo={article.cover} alt="" sizes="64px" className="h-full w-full object-cover" /> : <Icon name="image" size={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink">{title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{topicLabel(article)}</span>
                </span>
                <span className="max-tablet:hidden">
                  <ArticleStatusLine article={article} today={today} />
                </span>
                <button
                  type="button"
                  aria-pressed={isPinned}
                  disabled={!isPinned && isFull}
                  title={!isPinned && isFull ? `Unpin one first: up to ${MAX_PINNED_ARTICLES} guides show first.` : undefined}
                  onClick={() => pin(article.id)}
                  className="m-0 inline-flex min-h-8 flex-none cursor-pointer items-center gap-1 rounded-full border border-solid border-line-strong bg-surface px-2.5 font-sans text-xs font-bold text-text hover:border-brand focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:border-saffron aria-pressed:bg-saffron aria-pressed:text-ink"
                >
                  <Icon name="star" size={14} />
                  {isPinned ? "Pinned" : "Pin"}
                  <span className="sr-only">: {title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="m-0 rounded-lg border border-dashed border-line-strong bg-page px-4 py-6 text-center text-caption text-muted-foreground">
          No travel guides about {name} yet. In a travel guide’s settings, tick {name} under “Regions”, and it shows here.
        </p>
      )}
    </FormSection>
  );
};

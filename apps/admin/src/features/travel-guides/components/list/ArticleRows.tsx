import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { formatDateTime } from "@/utils/formatDateTime";

import { ARTICLE_TOPICS, articlePath } from "../../constants";
import type { ArticleListItem } from "../../lib/articleListItem";
import { feedbackSummary } from "../../lib/guideFeedback";
import { ArticleStatusLine } from "../ArticleStatusLine";

type ArticleRowsProps = {
  articles: ArticleListItem[];
  siteName: (siteRegionId: string | null) => string;
  authorName: (authorId: string | null) => string;
  /** "YYYY-MM-DD" in Nepal. */
  today: string;
};

const topicLabel = (article: ArticleListItem) => ARTICLE_TOPICS.find((topic) => topic.value === article.topic)?.label ?? "";

/** One row per guide (a card on phones): photo, title, topic, website, author, status, readers' votes and last edit. */
export const ArticleRows = ({ articles, siteName, authorName, today }: ArticleRowsProps) => (
  <ul className="m-0 flex list-none flex-col overflow-hidden rounded-lg border border-solid border-border bg-surface p-0">
    {articles.map((article) => (
      <li key={article.id} className="border-b border-solid border-border last:border-b-0">
        <Link
          href={articlePath(article.id)}
          className="grid items-center gap-x-4 gap-y-2 px-4 py-3 text-text no-underline hover:bg-page focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring tablet:grid-cols-[minmax(0,1fr)_150px_150px_150px]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-18 flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/40">
              {article.cover ? <PhotoImage photo={article.cover} alt="" sizes="72px" className="h-full w-full object-cover" /> : <Icon name="article" size={22} />}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold text-ink">{article.title}</span>
              <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {topicLabel(article)}
                {article.isFeatured && <span className="rounded-full bg-saffron-tint px-2 font-bold text-saffron-ink">Featured</span>}
                {article.startHerePosition && <span className="rounded-full bg-brand-tint px-2 font-bold text-brand">Start here #{article.startHerePosition}</span>}
              </span>
            </span>
          </span>
          <span className="text-caption max-tablet:hidden">{siteName(article.siteRegionId)}</span>
          <span className="truncate text-caption max-tablet:hidden">{authorName(article.authorId) || "No author yet"}</span>
          <span className="flex flex-col gap-0.5">
            <ArticleStatusLine article={article} today={today} />
            {article.feedback && <span className="text-xs font-semibold text-ink">{feedbackSummary(article.feedback)}</span>}
            <span className="text-xs text-muted-foreground">Edited {formatDateTime(article.updatedAt)}</span>
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

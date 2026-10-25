import { cn } from "@ttn/ui/lib/utils";

import { formatCalendarDate } from "@/utils/formatDateTime";

import { ARTICLE_STATUSES } from "../constants";
import type { ArticleListItem } from "../lib/articleListItem";
import { isScheduled } from "../lib/articleListItem";
import type { ArticleStatus } from "../types";

const STATUS_STYLES: Record<ArticleStatus, { dot: string; text: string }> = {
  published: { dot: "bg-whatsapp", text: "text-whatsapp" },
  draft: { dot: "bg-saffron", text: "text-saffron-ink" },
  hidden: { dot: "bg-subtle", text: "text-muted-foreground" },
};

type ArticleStatusLineProps = {
  article: Pick<ArticleListItem, "status" | "publishedOn">;
  /** "YYYY-MM-DD" in Nepal. */
  today: string;
};

/** A guide's status with its colored dot: Published, Draft, Hidden, or "Goes live 28 Oct" while scheduled. */
export const ArticleStatusLine = ({ article, today }: ArticleStatusLineProps) => {
  const style = STATUS_STYLES[article.status];
  const label = isScheduled(article, today) && article.publishedOn ? `Goes live ${formatCalendarDate(article.publishedOn)}` : ARTICLE_STATUSES.find((status) => status.value === article.status)?.label;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-caption font-bold whitespace-nowrap", style.text)}>
      <span aria-hidden="true" className={cn("size-2 rounded-full", style.dot)} />
      {label}
    </span>
  );
};

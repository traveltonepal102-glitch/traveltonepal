import { PreferredSourceBadge } from "@/components/shared/PreferredSourceBadge";

import type { TocLink } from "../../guideArticles";
import type { GuideArticle } from "../../types";
import { MobileToc } from "../toc/MobileToc";
import { ArticleBlock } from "./ArticleBlock";
import { AuthorBox } from "./AuthorBox";
import { GuideFeedback } from "./GuideFeedback";

type ArticleBodyProps = {
  article: GuideArticle;
  toc: readonly TocLink[];
};

/**
 * The article: the body's blocks in the admin's order (quick answer and questions included; headed sections carry the
 * contents list's ids), then the author, "Was this guide helpful?" and Google's "Add as a preferred source" badge.
 */
export const ArticleBody = ({ article, toc }: ArticleBodyProps) => (
  <article className="flex min-w-0 flex-col gap-5">
    <MobileToc links={toc} />
    {article.blocks.map((block, index) => (
      <ArticleBlock key={`${block.type}-${index}`} block={block} article={article} />
    ))}
    <AuthorBox author={article.author} checker={article.checker} />
    <GuideFeedback slug={article.slug} />
    <div className="flex flex-col items-start gap-2.5 border-t border-line pt-5 print:hidden">
      <p className="text-body-sm text-text">Want our trekking guides to show up first when you search on Google?</p>
      <PreferredSourceBadge theme="dark" />
    </div>
  </article>
);

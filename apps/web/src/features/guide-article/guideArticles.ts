import type { GuideArticle } from "./types";

export const QUICK_ANSWER_ID = "quick-answer";
export const FAQ_ID = "faq";

export type TocLink = { id: string; label: string };

/** "In this guide", in the article's order: the quick answer, each headed section and the questions. */
export const articleToc = ({ blocks }: Pick<GuideArticle, "blocks">): TocLink[] =>
  blocks.flatMap((block) => {
    if (block.type === "quick") return [{ id: QUICK_ANSWER_ID, label: "Quick answer" }];
    if (block.type === "faq") return [{ id: FAQ_ID, label: "FAQ" }];
    return block.type === "text" || (block.type === "heading" && block.level === "h2") ? [{ id: block.id, label: block.tocLabel }] : [];
  });

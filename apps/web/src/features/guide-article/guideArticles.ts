import type { GuideArticle } from "./types";

export const QUICK_ANSWER_ID = "quick-answer";
export const FAQ_ID = "faq";

export type TocLink = { id: string; label: string };

/** "In this guide": the quick answer (when there is one), each headed section, and the questions (when there are some). */
export const articleToc = ({ blocks, faqs }: Pick<GuideArticle, "blocks" | "faqs">): TocLink[] => [
  ...(blocks.some((block) => block.type === "quick") ? [{ id: QUICK_ANSWER_ID, label: "Quick answer" }] : []),
  ...blocks.flatMap((block) => (block.type === "text" ? [{ id: block.id, label: block.tocLabel }] : [])),
  ...(faqs.length ? [{ id: FAQ_ID, label: "FAQ" }] : []),
];

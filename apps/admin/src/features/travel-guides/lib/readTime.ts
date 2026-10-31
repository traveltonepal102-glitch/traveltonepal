import { richTextToPlainText } from "@/lib/richText/richText";

import type { ArticleSection } from "../types";

/** A relaxed reading pace for practical guides. */
const WORDS_PER_MINUTE = 200;

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** The words a reader reads in one section (a trek card is a short card, not counted; the months table is a glance). */
const sectionText = (section: ArticleSection) => {
  if (section.type === "text") return `${section.heading} ${richTextToPlainText(section.body)}`;
  if (section.type === "paragraph" || section.type === "quick" || section.type === "callout") return richTextToPlainText(section.body);
  if (section.type === "check") return [section.heading, ...section.items].join(" ");
  if (section.type === "heading" || section.type === "months" || section.type === "cta" || section.type === "meet") return section.heading;
  if (section.type === "quote" || section.type === "tip" || section.type === "gquote") return section.text;
  if (section.type === "cost") return [section.heading, ...section.rows.map((row) => row.item)].join(" ");
  if (section.type === "table") return [section.heading, ...(section.hasHeader ? section.header : []), ...section.rows.flat()].join(" ");
  // Near enough for a reading time: the words between the tags.
  if (section.type === "html") return section.html.replace(/<[^>]*>/g, " ");
  if (section.type === "embed") return section.caption;
  if (section.type === "image") return section.caption;
  if (section.type === "faq") return section.items.map((item) => `${item.question} ${richTextToPlainText(item.answer)}`).join(" ");
  return "";
};

/** "8 min read", counted from the intro and the article body; at least 1 minute. */
export const readMinutes = ({ intro, sections }: { intro: string; sections: ArticleSection[] }) =>
  Math.max(1, Math.ceil(countWords([intro, ...sections.map(sectionText)].join(" ")) / WORDS_PER_MINUTE));

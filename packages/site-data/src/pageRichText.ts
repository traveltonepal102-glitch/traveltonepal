import { EMPTY_RICH_TEXT, isRichTextEmpty, richTextDocSchema } from "@ttn/ui/lib/richText";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

/** Plain paragraphs (how a page's first texts were saved) as a rich text document. */
const paragraphsDoc = (paragraphs: readonly string[]): RichTextDoc => {
  const filled = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  return filled.length ? { type: "doc", content: filled.map((paragraph) => ({ type: "paragraph", content: [{ type: "text", text: paragraph }] })) } : EMPTY_RICH_TEXT;
};

/** A page's rich text, or plain text (one string, or a list of paragraphs) saved before it became rich text. */
export const readPageRichText = (value: unknown): RichTextDoc => {
  if (typeof value === "string") return paragraphsDoc(value.split(/\n\s*\n/));
  if (Array.isArray(value)) return paragraphsDoc(value.filter((item): item is string => typeof item === "string"));
  const doc = richTextDocSchema.safeParse(value);
  return doc.success && !isRichTextEmpty(doc.data) ? doc.data : EMPTY_RICH_TEXT;
};

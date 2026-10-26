import { z } from "zod";

/**
 * Rich text as the admin saves it and the website shows it: a Tiptap (ProseMirror) JSON document limited to
 * paragraphs, small headings, bold, italic, links and lists. Stored as JSON, never HTML. Both apps check it with
 * richTextDocSchema: the admin before saving (apps/admin/src/lib/richText), the website when it reads it.
 */
export type RichTextMark = { type: "bold" } | { type: "italic" } | { type: "link"; attrs: { href: string } };
export type RichTextInline = { type: "text"; text: string; marks?: RichTextMark[] } | { type: "hardBreak" };
export type RichTextParagraph = { type: "paragraph"; content?: RichTextInline[] };
export type RichTextListItem = { type: "listItem"; content: RichTextBlock[] };
export type RichTextList = { type: "bulletList" | "orderedList"; content: RichTextListItem[] };
/** "Small heading" (level 3 in the document; the website picks the heading level that fits where it shows). */
export type RichTextHeading = { type: "heading"; attrs: { level: 3 }; content?: RichTextInline[] };
export type RichTextBlock = RichTextParagraph | RichTextHeading | RichTextList;
export type RichTextDoc = { type: "doc"; content: RichTextBlock[] };

export const EMPTY_RICH_TEXT: RichTextDoc = { type: "doc", content: [{ type: "paragraph" }] };

/** Links may go to web pages, email, or a page on our own site ("/treks/…", not "//other-site"). */
export const isSafeHref = (href: string) => /^(https?:\/\/[^\s]+|mailto:[^\s]+|\/(?!\/)[^\s]*)$/i.test(href);

const MAX_HREF_LENGTH = 2000;

const markSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }),
  z.object({ type: z.literal("italic") }),
  z.object({
    type: z.literal("link"),
    attrs: z.object({ href: z.string().trim().max(MAX_HREF_LENGTH).refine(isSafeHref) }),
  }),
]);

/** One inline: text with its marks, or a line break (also used by the legal text format, legalText.ts). */
export const richTextInlineSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().min(1), marks: z.array(markSchema).max(3).optional() }),
  z.object({ type: z.literal("hardBreak") }),
]);

const paragraphSchema = z.object({ type: z.literal("paragraph"), content: z.array(richTextInlineSchema).optional() });

const headingSchema = z.object({ type: z.literal("heading"), attrs: z.object({ level: z.literal(3) }), content: z.array(richTextInlineSchema).optional() });

const listItemSchema: z.ZodType<RichTextListItem> = z.object({
  type: z.literal("listItem"),
  content: z.lazy(() => z.array(richTextBlockSchema).min(1)),
});

const listSchema: z.ZodType<RichTextList> = z.object({
  type: z.enum(["bulletList", "orderedList"]),
  content: z.array(listItemSchema).min(1),
});

/** One block: a paragraph, a small heading or a list. */
export const richTextBlockSchema: z.ZodType<RichTextBlock> = z.union([paragraphSchema, headingSchema, listSchema]);

/** Exactly the format above: anything else (other nodes, unknown attributes, unsafe links) fails or is dropped. */
export const richTextDocSchema: z.ZodType<RichTextDoc> = z.object({
  type: z.literal("doc"),
  content: z.array(richTextBlockSchema),
});

/** Any value (e.g. the editor's own JSON, or a database column) → a checked document; anything else becomes empty. */
export const toRichTextDoc = (value: unknown): RichTextDoc => {
  const result = richTextDocSchema.safeParse(value);
  return result.success ? result.data : EMPTY_RICH_TEXT;
};

const inlineText = (inline: RichTextInline) => (inline.type === "text" ? inline.text : "\n");

/** A block's words; list items on their own lines. */
export const richTextBlockToPlainText = (block: RichTextBlock): string =>
  block.type === "paragraph" || block.type === "heading"
    ? (block.content ?? []).map(inlineText).join("")
    : block.content.map((item) => item.content.map(richTextBlockToPlainText).join("\n")).join("\n");

/** The words only, paragraphs separated by an empty line (for lengths, checks and Google). */
export const richTextToPlainText = (doc: RichTextDoc) => doc.content.map(richTextBlockToPlainText).join("\n\n").trim();

export const isRichTextEmpty = (doc: RichTextDoc) => richTextToPlainText(doc) === "";

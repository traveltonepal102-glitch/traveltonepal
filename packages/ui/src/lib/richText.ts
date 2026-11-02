import { z } from "zod";

import { PHOTO_FILE_NAME_MAX_LENGTH, PHOTO_FILE_NAME_PATTERN } from "./photos";

/**
 * Rich text as the admin saves it and the website shows it: a Tiptap (ProseMirror) JSON document limited to
 * paragraphs, small headings, bold, italic, links, lists, photos from the photo library and simple tables. Stored as JSON, never HTML. Both apps check it with
 * richTextDocSchema: the admin before saving (apps/admin/src/lib/richText), the website when it reads it.
 */
export type RichTextMark = { type: "bold" } | { type: "italic" } | { type: "link"; attrs: { href: string } };
export type RichTextInline = { type: "text"; text: string; marks?: RichTextMark[] } | { type: "hardBreak" };
export type RichTextParagraph = { type: "paragraph"; content?: RichTextInline[] };
export type RichTextListItem = { type: "listItem"; content: RichTextFlowBlock[] };
export type RichTextList = { type: "bulletList" | "orderedList"; content: RichTextListItem[] };
/** "Small heading" (level 3 in the document; the website picks the heading level that fits where it shows). */
export type RichTextHeading = { type: "heading"; attrs: { level: 3 }; content?: RichTextInline[] };
/**
 * A photo from the admin's photo library, by its id (never a pasted address): its size and the widths made for it,
 * so the website shows the right size, and its description for Google and screen readers.
 */
export type RichTextImage = {
  type: "image";
  /** fileName: the photo's file name (PhotoFiles), missing for photos put in before photos had one. */
  attrs: { photoId: string; alt: string; width: number; height: number; variantWidths: number[]; fileName?: string };
};
/** Anything but a table: what list items and table cells hold (a table never sits inside another table or a list). */
export type RichTextFlowBlock = RichTextParagraph | RichTextHeading | RichTextList | RichTextImage;
/** A cell of a table: a heading cell ("tableHeader", the first row's cells make the table's head) or a plain one. */
export type RichTextTableCell = { type: "tableHeader" | "tableCell"; content: RichTextFlowBlock[] };
export type RichTextTableRow = { type: "tableRow"; content: RichTextTableCell[] };
export type RichTextTable = { type: "table"; content: RichTextTableRow[] };
export type RichTextBlock = RichTextFlowBlock | RichTextTable;
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
  content: z.lazy(() => z.array(flowBlockSchema).min(1)),
});

const listSchema: z.ZodType<RichTextList> = z.object({
  type: z.enum(["bulletList", "orderedList"]),
  content: z.array(listItemSchema).min(1),
});

const imageSchema = z.object({
  type: z.literal("image"),
  attrs: z.object({
    photoId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
    alt: z.string().trim().max(250).catch(""),
    width: z.number().int().positive().max(20000),
    height: z.number().int().positive().max(20000),
    variantWidths: z.array(z.number().int().positive().max(20000)).min(1).max(12),
    fileName: z.string().max(PHOTO_FILE_NAME_MAX_LENGTH).regex(PHOTO_FILE_NAME_PATTERN).optional().catch(undefined),
  }),
});

const flowBlockSchema: z.ZodType<RichTextFlowBlock> = z.union([paragraphSchema, headingSchema, listSchema, imageSchema]);

/** At most 8 columns and 60 rows; unknown cell attributes (widths, merged cells) are dropped. */
const tableSchema = z.object({
  type: z.literal("table"),
  content: z
    .array(z.object({ type: z.literal("tableRow"), content: z.array(z.object({ type: z.enum(["tableHeader", "tableCell"]), content: z.array(flowBlockSchema).min(1) })).min(1).max(8) }))
    .min(1)
    .max(60),
});

/** One block: a paragraph, a small heading, a list, a photo or a table. */
export const richTextBlockSchema: z.ZodType<RichTextBlock> = z.union([paragraphSchema, headingSchema, listSchema, imageSchema, tableSchema]);

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

/** A block's words; list items and table rows on their own lines, a row's cells separated by a tab. */
export const richTextBlockToPlainText = (block: RichTextBlock): string => {
  if (block.type === "image") return "";
  if (block.type === "paragraph" || block.type === "heading") return (block.content ?? []).map(inlineText).join("");
  if (block.type === "table") return block.content.map((row) => row.content.map((cell) => cell.content.map(richTextBlockToPlainText).join(" ")).join("\t")).join("\n");
  return block.content.map((item) => item.content.map(richTextBlockToPlainText).join("\n")).join("\n");
};

/** The words only, paragraphs separated by an empty line (for lengths, checks and Google). */
export const richTextToPlainText = (doc: RichTextDoc) => doc.content.map(richTextBlockToPlainText).filter(Boolean).join("\n\n").trim();

export const isRichTextEmpty = (doc: RichTextDoc) => richTextToPlainText(doc) === "";

/** Every photo in a text, in order, list items and table cells included (e.g. to check each has a description). */
export const richTextImages = (blocks: readonly RichTextBlock[]): RichTextImage[] =>
  blocks.flatMap((block) => {
    if (block.type === "image") return [block];
    if (block.type === "bulletList" || block.type === "orderedList") return block.content.flatMap((item) => richTextImages(item.content));
    if (block.type === "table") return block.content.flatMap((row) => row.content.flatMap((cell) => richTextImages(cell.content)));
    return [];
  });

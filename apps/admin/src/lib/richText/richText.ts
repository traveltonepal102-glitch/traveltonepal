import { z } from "zod";

/**
 * Rich text as the admin saves it: a Tiptap (ProseMirror) JSON document limited to paragraphs, small headings,
 * bold, italic, links and lists. Stored as JSON, never HTML, and checked here on the server before saving:
 * anything else (other headings, images, styles, unknown attributes) is rejected or dropped.
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

/** The longest JSON the server reads for one field (a few thousand words, with room for formatting). */
const MAX_JSON_LENGTH = 100_000;
const MAX_HREF_LENGTH = 2000;

/** Links may go to web pages, email, or a page on our own site ("/treks/…", not "//other-site"). */
export const isSafeHref = (href: string) => /^(https?:\/\/[^\s]+|mailto:[^\s]+|\/(?!\/)[^\s]*)$/i.test(href);

/**
 * What someone types as a link address → a link: "nepal.gov.np" → "https://nepal.gov.np",
 * "info@example.com" → "mailto:info@example.com". Other schemes are kept as typed (isSafeHref decides).
 */
export const normalizeHref = (input: string) => {
  const value = input.trim();
  if (!value || value.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  if (/^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  return `https://${value}`;
};

const markSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }),
  z.object({ type: z.literal("italic") }),
  z.object({
    type: z.literal("link"),
    attrs: z.object({ href: z.string().trim().max(MAX_HREF_LENGTH).refine(isSafeHref) }),
  }),
]);

const inlineSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().min(1), marks: z.array(markSchema).max(3).optional() }),
  z.object({ type: z.literal("hardBreak") }),
]);

const paragraphSchema = z.object({ type: z.literal("paragraph"), content: z.array(inlineSchema).optional() });

const headingSchema = z.object({ type: z.literal("heading"), attrs: z.object({ level: z.literal(3) }), content: z.array(inlineSchema).optional() });

const listItemSchema: z.ZodType<RichTextListItem> = z.object({
  type: z.literal("listItem"),
  content: z.lazy(() => z.array(blockSchema).min(1)),
});

const listSchema: z.ZodType<RichTextList> = z.object({
  type: z.enum(["bulletList", "orderedList"]),
  content: z.array(listItemSchema).min(1),
});

const blockSchema: z.ZodType<RichTextBlock> = z.union([paragraphSchema, headingSchema, listSchema]);

export const richTextDocSchema: z.ZodType<RichTextDoc> = z.object({
  type: z.literal("doc"),
  content: z.array(blockSchema),
});

const inlineText = (inline: RichTextInline) => (inline.type === "text" ? inline.text : "\n");

const blockText = (block: RichTextBlock): string =>
  block.type === "paragraph" || block.type === "heading"
    ? (block.content ?? []).map(inlineText).join("")
    : block.content.map((item) => item.content.map(blockText).join("\n")).join("\n");

/** The words only, paragraphs separated by an empty line (for lengths, checks and Google). */
export const richTextToPlainText = (doc: RichTextDoc) => doc.content.map(blockText).join("\n\n").trim();

export const isRichTextEmpty = (doc: RichTextDoc) => richTextToPlainText(doc) === "";

/**
 * A form field holding a rich text document as JSON (what RichTextEditor posts). Checks the structure and the
 * length of the words; an empty document comes back as EMPTY_RICH_TEXT.
 */
export const richTextField = (maxCharacters: number) =>
  z
    .string()
    .max(MAX_JSON_LENGTH, "This text is too long.")
    .transform((json, context): RichTextDoc => {
      if (!json) return EMPTY_RICH_TEXT;
      let value: unknown;
      try {
        value = JSON.parse(json);
      } catch {
        value = undefined;
      }
      const result = richTextDocSchema.safeParse(value);
      if (result.success) return isRichTextEmpty(result.data) ? EMPTY_RICH_TEXT : result.data;

      context.addIssue({
        code: "custom",
        message: "This text has formatting that can't be saved. Links must start with https://, mailto: or /.",
      });
      return z.NEVER;
    })
    .refine((doc) => richTextToPlainText(doc).length <= maxCharacters, `Use ${maxCharacters} characters or fewer.`);

/** Any value (e.g. the editor's own JSON) → a checked document; anything it can't be becomes empty. */
export const toRichTextDoc = (value: unknown): RichTextDoc => {
  const result = richTextDocSchema.safeParse(value);
  return result.success ? result.data : EMPTY_RICH_TEXT;
};

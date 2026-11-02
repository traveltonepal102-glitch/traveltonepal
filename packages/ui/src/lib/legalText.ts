import { z } from "zod";

import { richTextBlockSchema, richTextBlockToPlainText, richTextImages, richTextInlineSchema } from "./richText";
import type { RichTextBlock, RichTextImage, RichTextInline, RichTextTable } from "./richText";

/**
 * The legal pages' text (Terms, Privacy, Impressum, Cookie settings), as the admin saves it and the website shows it:
 * the rich text format (richText.ts, simple tables included) plus numbered section headings (level 2: each starts a
 * section and a line in "On this page"). Stored as JSON, never HTML; both apps check it with legalTextDocSchema.
 */
export type LegalSectionHeading = { type: "heading"; attrs: { level: 2 }; content?: RichTextInline[] };
export type LegalTable = RichTextTable;
export type LegalBlock = RichTextBlock | LegalSectionHeading;
export type LegalTextDoc = { type: "doc"; content: LegalBlock[] };

export const EMPTY_LEGAL_TEXT: LegalTextDoc = { type: "doc", content: [{ type: "paragraph" }] };

const sectionHeadingSchema = z.object({ type: z.literal("heading"), attrs: z.object({ level: z.literal(2) }), content: z.array(richTextInlineSchema).optional() });

const legalBlockSchema: z.ZodType<LegalBlock> = z.union([sectionHeadingSchema, richTextBlockSchema]);

/** Exactly the format above: anything else (other nodes, unsafe links) fails; unknown attributes (cell widths) are dropped. */
export const legalTextDocSchema: z.ZodType<LegalTextDoc> = z.object({ type: z.literal("doc"), content: z.array(legalBlockSchema) });

/** Any value (the editor's JSON, a database column) → a checked document; anything else becomes empty. */
export const toLegalTextDoc = (value: unknown): LegalTextDoc => legalTextDocSchema.safeParse(value).data ?? EMPTY_LEGAL_TEXT;

export const isSectionHeading = (block: LegalBlock): block is LegalSectionHeading => block.type === "heading" && block.attrs.level === 2;

const inlineText = (content: readonly RichTextInline[] = []) => content.map((inline) => (inline.type === "text" ? inline.text : "\n")).join("");

const blockText = (block: LegalBlock): string => (isSectionHeading(block) ? inlineText(block.content) : richTextBlockToPlainText(block));

/** The words only (for lengths, word counts and checks). */
export const legalTextToPlainText = (doc: LegalTextDoc) => doc.content.map(blockText).join("\n\n").trim();

/** Every photo in a legal text, table cells included (e.g. to check each has a description). */
export const legalTextImages = (doc: LegalTextDoc): RichTextImage[] => doc.content.flatMap((block) => (isSectionHeading(block) ? [] : richTextImages([block])));

export type LegalSection = { heading: string; blocks: LegalBlock[] };

/** The text split at its section headings: what comes before the first one, then each numbered section. */
export const splitLegalSections = (doc: LegalTextDoc): { lead: LegalBlock[]; sections: LegalSection[] } => {
  const lead: LegalBlock[] = [];
  const sections: LegalSection[] = [];
  for (const block of doc.content) {
    // An empty section heading starts nothing: what follows stays with the section before.
    const heading = isSectionHeading(block) ? inlineText(block.content).trim() : "";
    if (heading) sections.push({ heading, blocks: [] });
    else if (!isSectionHeading(block)) (sections.at(-1)?.blocks ?? lead).push(block);
  }
  return { lead, sections };
};

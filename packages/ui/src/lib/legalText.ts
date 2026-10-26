import { z } from "zod";

import { richTextBlockSchema, richTextBlockToPlainText, richTextInlineSchema } from "./richText";
import type { RichTextBlock, RichTextInline } from "./richText";

/**
 * The legal pages' text (Terms, Privacy, Impressum, Cookie settings), as the admin saves it and the website shows it:
 * the rich text format (richText.ts) plus numbered section headings (level 2: each starts a section and a line in
 * "On this page") and simple tables. Stored as JSON, never HTML; both apps check it with legalTextDocSchema.
 */
export type LegalSectionHeading = { type: "heading"; attrs: { level: 2 }; content?: RichTextInline[] };
export type LegalTableCell = { type: "tableHeader" | "tableCell"; content: RichTextBlock[] };
export type LegalTableRow = { type: "tableRow"; content: LegalTableCell[] };
export type LegalTable = { type: "table"; content: LegalTableRow[] };
export type LegalBlock = RichTextBlock | LegalSectionHeading | LegalTable;
export type LegalTextDoc = { type: "doc"; content: LegalBlock[] };

export const EMPTY_LEGAL_TEXT: LegalTextDoc = { type: "doc", content: [{ type: "paragraph" }] };

const sectionHeadingSchema = z.object({ type: z.literal("heading"), attrs: z.object({ level: z.literal(2) }), content: z.array(richTextInlineSchema).optional() });

const cellSchema = z.object({ type: z.enum(["tableHeader", "tableCell"]), content: z.array(richTextBlockSchema).min(1) });

const tableSchema = z.object({
  type: z.literal("table"),
  content: z.array(z.object({ type: z.literal("tableRow"), content: z.array(cellSchema).min(1).max(8) })).min(1).max(60),
});

const legalBlockSchema: z.ZodType<LegalBlock> = z.union([sectionHeadingSchema, tableSchema, richTextBlockSchema]);

/** Exactly the format above: anything else (other nodes, unsafe links) fails; unknown attributes (cell widths) are dropped. */
export const legalTextDocSchema: z.ZodType<LegalTextDoc> = z.object({ type: z.literal("doc"), content: z.array(legalBlockSchema) });

/** Any value (the editor's JSON, a database column) → a checked document; anything else becomes empty. */
export const toLegalTextDoc = (value: unknown): LegalTextDoc => legalTextDocSchema.safeParse(value).data ?? EMPTY_LEGAL_TEXT;

export const isSectionHeading = (block: LegalBlock): block is LegalSectionHeading => block.type === "heading" && block.attrs.level === 2;

const inlineText = (content: readonly RichTextInline[] = []) => content.map((inline) => (inline.type === "text" ? inline.text : "\n")).join("");

const blockText = (block: LegalBlock): string => {
  if (block.type === "table") return block.content.map((row) => row.content.map((cell) => cell.content.map(richTextBlockToPlainText).join(" ")).join("\t")).join("\n");
  if (isSectionHeading(block)) return inlineText(block.content);
  return richTextBlockToPlainText(block);
};

/** The words only (for lengths, word counts and checks). */
export const legalTextToPlainText = (doc: LegalTextDoc) => doc.content.map(blockText).join("\n\n").trim();

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

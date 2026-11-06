import type { LegalBlock, LegalTable, LegalTextDoc } from "@ttn/ui/lib/legalText";
import type { RichTextInline } from "@ttn/ui/lib/richText";

const TOKEN = /\{([a-zA-Z]+)\}/g;

const fillText = (text: string, values: Record<string, string>) => text.replace(TOKEN, (token, key: string) => values[key] ?? token);

const fillInlines = (content: RichTextInline[] | undefined, values: Record<string, string>) =>
  content?.map((inline) => (inline.type === "text" ? { ...inline, text: fillText(inline.text, values) } : inline));

const fillBlock = <Block extends LegalBlock>(block: Block, values: Record<string, string>): Block => {
  if (block.type === "image") return block;
  if (block.type === "paragraph" || block.type === "heading") return { ...block, content: fillInlines(block.content, values) };
  if (block.type === "table") return { ...block, content: block.content.map((row) => ({ ...row, content: row.content.map((cell) => ({ ...cell, content: cell.content.map((child) => fillBlock(child, values)) })) })) };
  return { ...block, content: block.content.map((item) => ({ ...item, content: item.content.map((child) => fillBlock(child, values)) })) };
};

/** "{registers}" alone on a line: the paragraph's whole text, if it is one placeholder. */
const tablePlaceholder = (block: LegalBlock) => {
  if (block.type !== "paragraph") return undefined;
  const text = (block.content ?? []).map((inline) => (inline.type === "text" ? inline.text : "")).join("").trim();
  return /^\{([a-zA-Z]+)\}$/.exec(text)?.[1];
};

/**
 * A legal text with its placeholders filled in: {company}, {email}… by their values, and a line holding only a table
 * placeholder ({registers}, {cookieTable}) by that table (left out when the table has no rows). Unknown ones stay.
 */
export const fillLegalPlaceholders = (doc: LegalTextDoc, values: Record<string, string>, tables: Record<string, LegalTable>): LegalTextDoc => ({
  ...doc,
  content: doc.content.flatMap((block): LegalBlock[] => {
    const tableKey = tablePlaceholder(block);
    if (tableKey && tableKey in tables) {
      const table = tables[tableKey];
      return table.content.length > 1 ? [table] : [];
    }
    return [fillBlock(block, values)];
  }),
});

const cell = (type: "tableHeader" | "tableCell", text: string) => ({ type, content: [{ type: "paragraph" as const, content: text ? [{ type: "text" as const, text }] : [] }] });

/** A table in the legal text format, from a heading row and rows of plain text. */
export const legalTable = (head: readonly string[], rows: readonly (readonly string[])[]): LegalTable => ({
  type: "table",
  content: [
    { type: "tableRow", content: head.map((text) => cell("tableHeader", text)) },
    ...rows.map((row) => ({ type: "tableRow" as const, content: row.map((text) => cell("tableCell", text)) })),
  ],
});

/** "If you cancel" → "if-you-cancel", made unique on the page ("if-you-cancel-2"). */
export const sectionIds = (headings: readonly string[]) => {
  const seen = new Map<string, number>();
  return headings.map((heading) => {
    const base = heading.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
};

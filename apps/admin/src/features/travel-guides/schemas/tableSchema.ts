import { z } from "zod";

import { text } from "@/lib/forms/formFields";

import { SECTION_LIMITS as LIMIT, TABLE_SIZE } from "../sectionKinds";
import { sectionId } from "./sectionFields";

const cells = z.array(text(LIMIT.tableCell));

const hasText = (row: string[]) => row.some(Boolean);

/**
 * "Table": rows with no text are left out. A header or footer row that is switched off may keep its words (the
 * editor holds them until the row is switched back on); only rows that show are saved (toStoredSection).
 */
export const tableSection = z
  .object({
    id: sectionId,
    type: z.literal("table"),
    heading: text(LIMIT.heading),
    hasHeader: z.boolean(),
    hasFooter: z.boolean(),
    hasRowHeadings: z.boolean(),
    header: cells,
    rows: z.array(cells).transform((rows) => rows.filter(hasText)),
    footer: cells,
  })
  .superRefine((table, context) => {
    const columns = table.header.length;
    const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
    if (columns < 1 || columns > TABLE_SIZE.maxColumns) issue("rows", `Use 1 to ${TABLE_SIZE.maxColumns} columns.`);
    else if ([...table.rows, table.footer].some((row) => row.length !== columns)) issue("rows", "The table's rows don't line up. Reload the page and try again.");
    if (!table.rows.length) issue("rows", "Write in at least one row, or remove this section.");
    if (table.rows.length > TABLE_SIZE.maxRows) issue("rows", `Up to ${TABLE_SIZE.maxRows} rows.`);
    if (table.hasHeader && !hasText(table.header)) issue("header", "Write the header row, or switch it off.");
    if (table.hasFooter && !hasText(table.footer)) issue("footer", "Write the footer row, or switch it off.");
  });

import { TABLE_SIZE } from "../sectionKinds";
import type { ArticleSection } from "../types";

type Table = Extract<ArticleSection, { type: "table" }>;

/** A table's cells: the header and footer rows and the rows between, all as wide as the header. */
export type TableCells = Pick<Table, "header" | "rows" | "footer">;

/** A cell's row: the header, the footer or a row between (0 first). */
export type TableRow = "header" | "footer" | number;

const emptyRow = (columns: number) => Array.from({ length: columns }, () => "");

export const emptyTableCells = (columns = 3, rows = 2): TableCells => ({
  header: emptyRow(columns),
  rows: Array.from({ length: rows }, () => emptyRow(columns)),
  footer: emptyRow(columns),
});

const everyRow = (cells: TableCells, change: (row: string[]) => string[]): TableCells => ({
  header: change(cells.header),
  rows: cells.rows.map(change),
  footer: change(cells.footer),
});

export const setTableCell = (cells: TableCells, row: TableRow, column: number, value: string): TableCells => {
  const change = (cellsOfRow: string[]) => cellsOfRow.map((cell, at) => (at === column ? value : cell));
  if (row === "header") return { ...cells, header: change(cells.header) };
  if (row === "footer") return { ...cells, footer: change(cells.footer) };
  return { ...cells, rows: cells.rows.map((cellsOfRow, at) => (at === row ? change(cellsOfRow) : cellsOfRow)) };
};

/** A new empty row at the end, up to the most rows. */
export const addTableRow = (cells: TableCells): TableCells =>
  cells.rows.length >= TABLE_SIZE.maxRows ? cells : { ...cells, rows: [...cells.rows, emptyRow(cells.header.length)] };

/** A table keeps at least one row. */
export const removeTableRow = (cells: TableCells, index: number): TableCells =>
  cells.rows.length <= 1 ? cells : { ...cells, rows: cells.rows.filter((_, at) => at !== index) };

/** A new empty column on the right, up to the most columns. */
export const addTableColumn = (cells: TableCells): TableCells => (cells.header.length >= TABLE_SIZE.maxColumns ? cells : everyRow(cells, (row) => [...row, ""]));

/** A table keeps at least one column. */
export const removeTableColumn = (cells: TableCells, index: number): TableCells =>
  cells.header.length <= 1 ? cells : everyRow(cells, (row) => row.filter((_, at) => at !== index));

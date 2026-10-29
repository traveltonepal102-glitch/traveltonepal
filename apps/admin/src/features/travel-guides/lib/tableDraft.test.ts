import { describe, expect, it } from "vitest";

import { TABLE_SIZE } from "../sectionKinds";
import { addTableColumn, addTableRow, emptyTableCells, removeTableColumn, removeTableRow, setTableCell } from "./tableDraft";

describe("table cells", () => {
  it("starts with 3 columns and 2 rows, header and footer as wide", () => {
    expect(emptyTableCells()).toEqual({ header: ["", "", ""], rows: [["", "", ""], ["", "", ""]], footer: ["", "", ""] });
  });

  it("changes one cell of the header, the footer or a row", () => {
    const cells = setTableCell(setTableCell(setTableCell(emptyTableCells(2, 1), "header", 0, "Village"), "footer", 1, "Total"), 0, 1, "2,480 m");
    expect(cells).toEqual({ header: ["Village", ""], rows: [["", "2,480 m"]], footer: ["", "Total"] });
  });

  it("adds and removes rows and columns, keeping one of each and the most allowed", () => {
    const cells = setTableCell(emptyTableCells(2, 2), 1, 0, "Kept");
    expect(removeTableRow(cells, 0).rows).toEqual([["Kept", ""]]);
    expect(removeTableRow(emptyTableCells(2, 1), 0).rows).toHaveLength(1);
    expect(addTableRow(cells).rows).toHaveLength(3);
    expect(addTableRow(emptyTableCells(1, TABLE_SIZE.maxRows)).rows).toHaveLength(TABLE_SIZE.maxRows);

    expect(addTableColumn(cells)).toMatchObject({ header: ["", "", ""], footer: ["", "", ""] });
    expect(removeTableColumn(cells, 1)).toEqual({ header: [""], rows: [[""], ["Kept"]], footer: [""] });
    expect(removeTableColumn(emptyTableCells(1, 1), 0).header).toHaveLength(1);
    expect(addTableColumn(emptyTableCells(TABLE_SIZE.maxColumns, 1)).header).toHaveLength(TABLE_SIZE.maxColumns);
  });
});

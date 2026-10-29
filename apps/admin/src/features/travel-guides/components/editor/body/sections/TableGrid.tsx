import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { inputClass } from "@/components/ui/formStyles";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { TableCells, TableRow } from "../../../../lib/tableDraft";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type TableGridProps = {
  cells: TableCells;
  hasHeader: boolean;
  hasFooter: boolean;
  hasRowHeadings: boolean;
  /** e.g. "sections.3" for the cells' errors. */
  field: string;
  errors: FieldErrors;
  onCellChange: (row: TableRow, column: number, value: string) => void;
  onRemoveRow: (index: number) => void;
  onRemoveColumn: (index: number) => void;
};

const ROW_NAMES = { header: "Header", footer: "Footer" } as const;

/** The table as it will show, a text field per cell, with a remove button over each column and after each row. */
export const TableGrid = ({ cells, hasHeader, hasFooter, hasRowHeadings, field, errors, onCellChange, onRemoveRow, onRemoveColumn }: TableGridProps) => {
  const columns = cells.header.length;

  // Plain text inputs that follow the table, so a cell's place is a fine key.
  const cellRow = (row: TableRow, values: string[], rowClassName: string) => {
    const rowName = typeof row === "number" ? `Row ${row + 1}` : ROW_NAMES[row];
    const errorPath = typeof row === "number" ? `rows.${row}` : row;
    return (
      <tr key={String(row)} className={rowClassName}>
        {values.map((value, column) => (
          <td key={column} className="p-1">
            <input
              aria-label={`${rowName}, column ${column + 1}`}
              value={value}
              onChange={(event) => onCellChange(row, column, event.target.value)}
              maxLength={LIMIT.tableCell}
              aria-invalid={errors[`${field}.${errorPath}.${column}`] ? true : undefined}
              className={cn(inputClass, "h-9 min-w-32", (typeof row !== "number" || (hasRowHeadings && column === 0)) && "font-bold")}
            />
          </td>
        ))}
        <td className="w-9 p-1">
          {typeof row === "number" && (
            <button type="button" className={ghostIconButton} aria-label={`Remove row ${row + 1}`} title="Remove row" disabled={cells.rows.length <= 1} onClick={() => onRemoveRow(row)}>
              <Icon name="close" size={16} />
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-solid border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cells.header.map((_, column) => (
              <th key={column} scope="col" className="p-1 pb-0 text-center">
                <button type="button" className={ghostIconButton} aria-label={`Remove column ${column + 1}`} title="Remove column" disabled={columns <= 1} onClick={() => onRemoveColumn(column)}>
                  <Icon name="close" size={16} />
                </button>
              </th>
            ))}
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {hasHeader && cellRow("header", cells.header, "bg-page")}
          {cells.rows.map((row, index) => cellRow(index, row, "border-t border-solid border-border"))}
          {hasFooter && cellRow("footer", cells.footer, "border-t border-solid border-border bg-brand-tint")}
        </tbody>
      </table>
    </div>
  );
};

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { TableCells } from "../../../../lib/tableDraft";
import { addTableColumn, addTableRow, removeTableColumn, removeTableRow, setTableCell } from "../../../../lib/tableDraft";
import { SECTION_LIMITS as LIMIT, TABLE_SIZE } from "../../../../sectionKinds";
import type { ArticleSection } from "../../../../types";
import { TableGrid } from "./TableGrid";

type Table = Extract<ArticleSection, { type: "table" }>;

type TableFieldsProps = {
  table: Table;
  /** e.g. "sections.3" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: Partial<Omit<Table, "id" | "type">>) => void;
};

const SWITCHES = [
  { key: "hasHeader", label: "Header row", note: "The first row names the columns." },
  { key: "hasFooter", label: "Footer row", note: "A last row in bold, e.g. a total." },
  { key: "hasRowHeadings", label: "First column as row headings", note: "Each row’s first cell in bold." },
] as const;

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** "Table": a heading if wanted, the header and footer switches, then the cells; rows and columns are added or removed. */
export const TableFields = ({ table, field, errors, onChange }: TableFieldsProps) => {
  const cells: TableCells = { header: table.header, rows: table.rows, footer: table.footer };
  const columns = table.header.length;
  // The cells' errors (the heading shows its own), e.g. "Write in at least one row" or a cell that is too long.
  const error = errors[`${field}.rows`] ?? Object.entries(errors).find(([key]) => key.startsWith(`${field}.`) && key !== `${field}.heading`)?.[1];

  return (
    <>
      <TextField name="sectionTableHeading" label="Heading" labelNote="(optional)" value={table.heading} onValueChange={(next) => onChange({ heading: next })} placeholder="Walking times from Syabrubesi" maxLength={LIMIT.heading} error={errors[`${field}.heading`]} />
      <div className="flex flex-wrap gap-x-6 gap-y-2.5">
        {SWITCHES.map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center gap-2.5">
            <Switch label={item.label} checked={table[item.key]} onChange={(event) => onChange({ [item.key]: event.target.checked })} />
            <span>
              <span className="block text-caption font-semibold text-ink">{item.label}</span>
              <span className="block text-xs text-muted-foreground">{item.note}</span>
            </span>
          </label>
        ))}
      </div>
      <TableGrid
        cells={cells}
        hasHeader={table.hasHeader}
        hasFooter={table.hasFooter}
        hasRowHeadings={table.hasRowHeadings}
        field={field}
        errors={errors}
        onCellChange={(row, column, value) => onChange(setTableCell(cells, row, column, value))}
        onRemoveRow={(index) => onChange(removeTableRow(cells, index))}
        onRemoveColumn={(index) => onChange(removeTableColumn(cells, index))}
      />
      <FieldError id={`${field}-table-error`} message={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={smallButton} disabled={table.rows.length >= TABLE_SIZE.maxRows} onClick={() => onChange(addTableRow(cells))}>
          <Icon name="add" size={16} />
          Add row
        </button>
        <button type="button" className={smallButton} disabled={columns >= TABLE_SIZE.maxColumns} onClick={() => onChange(addTableColumn(cells))}>
          <Icon name="add" size={16} />
          Add column
        </button>
        <span className="text-xs text-muted-foreground">
          {columns} {columns === 1 ? "column" : "columns"} · {table.rows.length} {table.rows.length === 1 ? "row" : "rows"} (up to {TABLE_SIZE.maxColumns} and {TABLE_SIZE.maxRows}). Empty rows are left out.
        </span>
      </div>
    </>
  );
};

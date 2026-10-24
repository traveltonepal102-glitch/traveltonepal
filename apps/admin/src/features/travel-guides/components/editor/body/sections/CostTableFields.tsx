import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_COST_ROWS, SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import type { CostRow } from "../../../../types";

type CostTableFieldsProps = {
  heading: string;
  rows: CostRow[];
  totalLabel: string;
  total: string;
  /** e.g. "sections.6" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { heading?: string; rows?: CostRow[]; totalLabel?: string; total?: string }) => void;
};

/** "Cost table": a list of costs and, if wanted, a total. Prices are written as shown, e.g. "$30" or "$25–30". */
export const CostTableFields = ({ heading, rows, totalLabel, total, field, errors, onChange }: CostTableFieldsProps) => {
  const updateRow = (index: number, patch: Partial<CostRow>) => onChange({ rows: rows.map((row, at) => (at === index ? { ...row, ...patch } : row)) });

  return (
    <>
      <TextField name="sectionCostHeading" label="Heading" labelNote="(optional)" value={heading} onValueChange={(next) => onChange({ heading: next })} placeholder="What Langtang costs" maxLength={LIMIT.heading} error={errors[`${field}.heading`]} />
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Costs</span>
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {rows.map((row, index) => (
            // Plain text inputs that follow the list, so a line's place is a fine key.
            <li key={index} className="grid grid-cols-[minmax(0,1fr)_120px_auto] items-center gap-2">
              <input aria-label={`Line ${index + 1}: item`} value={row.item} onChange={(event) => updateRow(index, { item: event.target.value })} placeholder="National park permit" maxLength={LIMIT.costItem} aria-invalid={errors[`${field}.rows.${index}.item`] ? true : undefined} className={cn(inputClass, "h-9.5")} />
              <input aria-label={`Line ${index + 1}: price`} value={row.price} onChange={(event) => updateRow(index, { price: event.target.value })} placeholder="$30" maxLength={LIMIT.costPrice} aria-invalid={errors[`${field}.rows.${index}.price`] ? true : undefined} className={cn(inputClass, "h-9.5")} />
              <button type="button" className={ghostIconButton} aria-label={`Remove line ${index + 1}`} onClick={() => onChange({ rows: rows.filter((_, at) => at !== index) })}>
                <Icon name="close" size={16} />
              </button>
            </li>
          ))}
        </ol>
        <FieldError id={`${field}-rows-error`} message={errors[`${field}.rows`] ?? Object.entries(errors).find(([key]) => key.startsWith(`${field}.rows.`))?.[1]} />
        <button type="button" onClick={() => onChange({ rows: [...rows, { item: "", price: "" }] })} disabled={rows.length >= MAX_COST_ROWS} className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}>
          <Icon name="add" size={16} />
          Add line
        </button>
      </div>
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_150px]">
        <TextField name="sectionCostTotalLabel" label="Total line" labelNote="(optional)" value={totalLabel} onValueChange={(next) => onChange({ totalLabel: next })} placeholder="Total, 10 days" maxLength={LIMIT.costTotalLabel} error={errors[`${field}.totalLabel`]} />
        <TextField name="sectionCostTotal" label="Total" value={total} onValueChange={(next) => onChange({ total: next })} placeholder="$1,250" maxLength={LIMIT.costPrice} error={errors[`${field}.total`]} />
      </div>
    </>
  );
};

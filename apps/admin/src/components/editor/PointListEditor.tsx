"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

type Point = { title: string; text: string };
type PointRow = Point & { id: string };

type PointListEditorProps = {
  /** Form field prefix: rows are sent as <prefix>Title and <prefix>Text. */
  prefix: string;
  /** The saved field, for its errors ("highlights" → "highlights.2.text"). */
  field: string;
  /** One row's name, e.g. "Highlight" → "Highlight 1". */
  itemLabel: string;
  points: Point[];
  maxItems: number;
  limits: { title: number; text: number };
  placeholders: Point;
  errors: FieldErrors;
  onEdit: () => void;
  /**
   * "stacked": a card per point, title above a two-line text (longer points, like highlights).
   * "rows": one line per point under shared column headings (short items, like "Permits: TIMS card").
   */
  layout?: "stacked" | "rows";
};

type RowActionsProps = { label: string; isFirst: boolean; isLast: boolean; onUp: () => void; onDown: () => void; onRemove: () => void; className?: string };

const RowActions = ({ label, isFirst, isLast, onUp, onDown, onRemove, className }: RowActionsProps) => (
  <div className={cn("flex gap-0.5", className)}>
    <button type="button" className={ghostIconButton} aria-label={`Move ${label} up`} disabled={isFirst} onClick={onUp}>
      <Icon name="arrow_upward" size={18} />
    </button>
    <button type="button" className={ghostIconButton} aria-label={`Move ${label} down`} disabled={isLast} onClick={onDown}>
      <Icon name="arrow_downward" size={18} />
    </button>
    <button type="button" className={ghostIconButton} aria-label={`Remove ${label}`} onClick={onRemove}>
      <Icon name="delete" size={18} />
    </button>
  </div>
);

/** An ordered list of "bold title + one line" points: add, reorder and remove rows. */
export const PointListEditor = ({ prefix, field, itemLabel, points, maxItems, limits, placeholders, errors, onEdit, layout = "stacked" }: PointListEditorProps) => {
  const [rows, setRows] = useState<PointRow[]>(() => points.map((point, index) => ({ ...point, id: `saved-${index}` })));
  const isRows = layout === "rows";

  const update = (next: PointRow[]) => {
    setRows(next);
    onEdit();
  };

  const move = (from: number, to: number) => {
    const next = [...rows];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    update(next);
  };

  return (
    <div className={cn("flex flex-col", isRows ? "gap-1.5" : "gap-2.5")}>
      {isRows && rows.length > 0 && (
        <div aria-hidden="true" className="grid grid-cols-[minmax(0,3fr)_minmax(0,5fr)_108px] gap-2 px-1 text-xs font-bold text-muted-foreground max-tablet:hidden">
          <span>Bold lead-in</span>
          <span>Text</span>
        </div>
      )}
      {rows.map((row, index) => {
        const number = index + 1;
        const label = `${itemLabel.toLowerCase()} ${number}`;
        const actions = (
          <RowActions
            label={label}
            isFirst={index === 0}
            isLast={index === rows.length - 1}
            onUp={() => move(index, index - 1)}
            onDown={() => move(index, index + 1)}
            onRemove={() => update(rows.filter((other) => other.id !== row.id))}
            className={isRows ? "items-start pt-1" : "flex-col pt-6"}
          />
        );
        const title = (
          <TextField
            name={`${prefix}Title`}
            label={`${itemLabel} ${number}`}
            isLabelHidden={isRows}
            defaultValue={row.title}
            placeholder={placeholders.title}
            error={errors[`${field}.${index}.title`]}
            maxLength={limits.title}
            inputClassName="font-bold"
          />
        );
        const text = (
          <TextField
            name={`${prefix}Text`}
            label={isRows ? `Text for ${label}` : "Text"}
            isLabelHidden={isRows}
            multiline
            rows={isRows ? 1 : 2}
            defaultValue={row.text}
            placeholder={placeholders.text}
            error={errors[`${field}.${index}.text`]}
            maxLength={limits.text}
            // In rows, the text grows with its sentence (one line when short) instead of hiding the end.
            inputClassName={isRows ? "min-h-10.5 resize-none [field-sizing:content]" : undefined}
          />
        );

        if (isRows) {
          return (
            <div key={row.id} className="grid items-start gap-2 tablet:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_108px]">
              {title}
              {text}
              {actions}
            </div>
          );
        }
        return (
          <div key={row.id} className="flex gap-2 rounded-xl border border-solid border-border bg-page p-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {title}
              {text}
            </div>
            {actions}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => update([...rows, { id: crypto.randomUUID(), title: "", text: "" }])}
        disabled={rows.length >= maxItems}
        className={cn(secondaryButton, "mt-1 min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add {itemLabel.toLowerCase()}
      </button>
      <FieldError id={`${field}-error`} message={errors[field]} />
    </div>
  );
};

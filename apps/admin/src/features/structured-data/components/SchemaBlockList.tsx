"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SCHEMA_LIMITS } from "../constants";
import type { SchemaBlock } from "../types";
import { SchemaBlockCard } from "./SchemaBlockCard";

type BlockRow = SchemaBlock & { id: string };

type SchemaBlockListProps = {
  blocks: SchemaBlock[];
  automaticTypes: string[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** The page's own JSON-LD blocks, in order: add, move and remove them (saved with the page's Save). */
export const SchemaBlockList = ({ blocks, automaticTypes, errors, onEdit }: SchemaBlockListProps) => {
  const [rows, setRows] = useState<BlockRow[]>(() => blocks.map((block, index) => ({ ...block, id: `saved-${index}` })));

  const update = (next: BlockRow[]) => {
    setRows(next);
    onEdit();
  };

  const move = (from: number, to: number) => {
    const next = [...rows];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    update(next);
  };

  const add = () => update([...rows, { id: crypto.randomUUID(), label: "", json: "", isShown: true }]);

  return (
    <FormSection title="Your schemas" hint="Each one is added to the page as JSON-LD for Google, in this order.">
      {rows.length === 0 && <p className="m-0 text-muted-foreground">No schemas of your own on this page yet.</p>}
      {rows.map((row, index) => (
        <SchemaBlockCard
          key={row.id}
          index={index}
          count={rows.length}
          block={row}
          automaticTypes={automaticTypes}
          errors={{ label: errors[`schemas.${index}.label`], json: errors[`schemas.${index}.json`] }}
          onMove={(to) => move(index, to)}
          onRemove={() => update(rows.filter((_, rowIndex) => rowIndex !== index))}
        />
      ))}
      <button type="button" className={cn(secondaryButton, "min-h-8 self-start px-2.5 text-caption")} onClick={add} disabled={rows.length >= SCHEMA_LIMITS.blocks}>
        <Icon name="add" size={16} />
        Add a schema
      </button>
      <FieldError id="schemas-error" message={errors.schemas} />
    </FormSection>
  );
};

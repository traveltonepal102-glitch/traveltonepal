"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";

import { SCHEMA_LIMITS } from "../constants";
import { mainTypes, parseSchemaJson } from "../lib/schemaJson";
import { SCHEMA_FIELDS } from "../schemas/pageSchemasSchema";
import type { SchemaBlock } from "../types";

const iconButton =
  "m-0 inline-flex size-8.5 flex-none cursor-pointer items-center justify-center rounded-sm border border-solid border-transparent bg-transparent text-text hover:border-input hover:bg-surface hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring";

const EXAMPLE = `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "…"
}`;

type SchemaBlockCardProps = {
  index: number;
  count: number;
  block: SchemaBlock;
  /** Types the website already writes on this page. */
  automaticTypes: string[];
  errors: { label?: string; json?: string };
  onMove: (to: number) => void;
  onRemove: () => void;
};

/** What the JSON holds as it is typed: its types and any type the website already writes, or what is wrong. */
const LiveCheck = ({ json, automaticTypes }: { json: string; automaticTypes: string[] }) => {
  if (!json.trim()) return null;
  const result = parseSchemaJson(json);
  if (!result.ok) {
    return (
      <p className="m-0 flex items-start gap-1.5 text-xs text-saffron-ink">
        <Icon name="warning" size={16} className="flex-none" />
        {result.message}
      </p>
    );
  }

  const types = mainTypes(result.data);
  const repeated = types.filter((type) => automaticTypes.includes(type));
  return (
    <div className="flex flex-col gap-1 text-xs">
      <p className="m-0 flex items-center gap-1.5 text-whatsapp">
        <Icon name="check_circle" size={16} className="flex-none" />
        Valid JSON-LD: {types.join(", ")}
      </p>
      {repeated.length > 0 && (
        <p className="m-0 flex items-start gap-1.5 text-saffron-ink">
          <Icon name="warning" size={16} className="flex-none" />
          The website already writes a {repeated.join(" and a ")} on this page. Two of the same can confuse Google: add to it only
          if you mean to.
        </p>
      )}
    </div>
  );
};

/** One JSON-LD block: a name for the admin, the JSON as pasted, and whether the website shows it. */
export const SchemaBlockCard = ({ index, count, block, automaticTypes, errors, onMove, onRemove }: SchemaBlockCardProps) => {
  const [json, setJson] = useState(block.json);
  const [isShown, setIsShown] = useState(block.isShown);
  const number = index + 1;

  return (
    <div className="flex gap-2 rounded-xl border border-solid border-border bg-page p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-60 flex-1">
            <TextField name={SCHEMA_FIELDS.label} label={`Schema ${number}: name`} labelNote="(only shown here)" defaultValue={block.label} error={errors.label} maxLength={SCHEMA_LIMITS.label} placeholder="Trek video" />
          </div>
          <label className="flex h-10.5 cursor-pointer items-center gap-2.5 text-caption font-bold text-ink">
            <input type="hidden" name={SCHEMA_FIELDS.isShown} value={isShown ? "on" : "off"} />
            On the website
            <Switch label={`Show schema ${number} on the website`} checked={isShown} onChange={(event) => setIsShown(event.target.checked)} />
          </label>
        </div>
        <TextField
          name={SCHEMA_FIELDS.json}
          label="JSON-LD"
          hint="Paste it with or without the <script> tag around it."
          value={json}
          onValueChange={setJson}
          error={errors.json}
          multiline
          rows={12}
          placeholder={EXAMPLE}
          inputClassName="font-mono text-xs leading-normal"
        />
        {!errors.json && <LiveCheck json={json} automaticTypes={automaticTypes} />}
      </div>
      <div className="flex flex-col gap-1 pt-6">
        <button type="button" className={iconButton} aria-label={`Move schema ${number} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
          <Icon name="arrow_upward" size={18} />
        </button>
        <button type="button" className={iconButton} aria-label={`Move schema ${number} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
          <Icon name="arrow_downward" size={18} />
        </button>
        <button type="button" className={iconButton} aria-label={`Remove schema ${number}`} onClick={onRemove}>
          <Icon name="delete" size={18} />
        </button>
      </div>
    </div>
  );
};

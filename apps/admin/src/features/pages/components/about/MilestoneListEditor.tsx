"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_MILESTONES, PAGE_LIMITS as LIMIT } from "../../constants";
import type { MilestoneValues } from "../../types";

type MilestoneRow = MilestoneValues & { id: string };

type MilestoneListEditorProps = { milestones: MilestoneValues[]; errors: FieldErrors; onEdit: () => void };

/** "Timeline": key moments, oldest first, up to four (shown left to right under the story). Sent as milestoneYear/Title/Text. */
export const MilestoneListEditor = ({ milestones, errors, onEdit }: MilestoneListEditorProps) => {
  const [rows, setRows] = useState<MilestoneRow[]>(() => milestones.map((milestone, index) => ({ ...milestone, id: `saved-${index}` })));
  const update = (next: MilestoneRow[]) => {
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
    <FormSection
      title="Timeline"
      hint="Key moments, oldest first. The last one is usually “Today”."
      aside={
        <button type="button" className={cn(secondaryButton, "min-h-8 px-2.5 text-caption")} disabled={rows.length >= MAX_MILESTONES} onClick={() => update([...rows, { id: crypto.randomUUID(), year: "", title: "", text: "" }])}>
          <Icon name="add" size={16} />
          Add moment
        </button>
      }
    >
      {!rows.length && <p className="m-0 text-caption text-muted-foreground">No moments yet: the timeline is left out.</p>}
      {rows.map((row, index) => (
        <div key={row.id} className="flex gap-2 rounded-xl border border-solid border-border bg-page p-2.5">
          <div className="grid flex-1 gap-2 tablet:grid-cols-[110px_minmax(0,1fr)]">
            <TextField name="milestoneYear" label={`Year ${index + 1}`} defaultValue={row.year} placeholder="2015" maxLength={LIMIT.milestoneYear} error={errors[`milestones.${index}.year`]} />
            <div className="flex flex-col gap-2">
              <TextField name="milestoneTitle" label="Title" defaultValue={row.title} maxLength={LIMIT.milestoneTitle} inputClassName="font-bold" error={errors[`milestones.${index}.title`]} />
              <TextField name="milestoneText" label="Text" isLabelHidden defaultValue={row.text} maxLength={LIMIT.milestoneText} error={errors[`milestones.${index}.text`]} />
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-6">
            <button type="button" className={ghostIconButton} aria-label={`Move moment ${index + 1} up`} disabled={index === 0} onClick={() => move(index, index - 1)}>
              <Icon name="arrow_upward" size={18} />
            </button>
            <button type="button" className={ghostIconButton} aria-label={`Move moment ${index + 1} down`} disabled={index === rows.length - 1} onClick={() => move(index, index + 1)}>
              <Icon name="arrow_downward" size={18} />
            </button>
            <button type="button" className={ghostIconButton} aria-label={`Remove moment ${index + 1}`} onClick={() => update(rows.filter((_, rowIndex) => rowIndex !== index))}>
              <Icon name="delete" size={18} />
            </button>
          </div>
        </div>
      ))}
      {errors.milestones && <p className="m-0 text-caption text-danger">{errors.milestones}</p>}
    </FormSection>
  );
};

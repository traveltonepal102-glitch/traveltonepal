"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_WHY_POINTS, REGION_LIMITS as LIMIT, WHY_POINT_ICONS } from "../../../constants";
import type { WhyPoint } from "../../../types";

type WhyPointsEditorProps = {
  points: WhyPoint[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** The cards under the introduction (icon, title, one line), up to 4. Sent as whyIcon / whyTitle / whyText. */
export const WhyPointsEditor = ({ points, errors, onEdit }: WhyPointsEditorProps) => {
  const list = useRowList<WhyPoint>(points, onEdit);
  const rowError = (index: number, field: string) => errors[`whyPoints.${index}.${field}`];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-label text-ink">Why trek here</span>
      <span className="-mt-1 text-xs text-muted-foreground">Up to {MAX_WHY_POINTS} cards under the introduction, two by two.</span>
      {list.rows.map((row, index) => (
        <div key={row.key} className="grid items-start gap-2 rounded-xl border border-solid border-border bg-page p-2.5 tablet:grid-cols-[170px_minmax(0,1fr)_minmax(0,1.6fr)_auto]">
          <SelectField name="whyIcon" label={`Icon, card ${index + 1}`} isLabelHidden options={WHY_POINT_ICONS} defaultValue={row.icon} error={rowError(index, "icon")} />
          <TextField name="whyTitle" label={`Title, card ${index + 1}`} isLabelHidden defaultValue={row.title} placeholder="Gentle climb" maxLength={LIMIT.whyTitle} error={rowError(index, "title")} inputClassName="font-bold" />
          <TextField
            name="whyText"
            label={`Text, card ${index + 1}`}
            isLabelHidden
            multiline
            rows={1}
            defaultValue={row.text}
            placeholder="Gradual height gain, good for a first Himalayan trek."
            maxLength={LIMIT.whyText}
            error={rowError(index, "text")}
            inputClassName="min-h-10.5 resize-none [field-sizing:content]"
          />
          <span className="flex gap-0.5 pt-1">
            <button type="button" className={ghostIconButton} aria-label={`Move card ${index + 1} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
              <Icon name="arrow_upward" size={18} />
            </button>
            <button type="button" className={ghostIconButton} aria-label={`Remove card ${index + 1}`} onClick={() => list.remove(row.key)}>
              <Icon name="delete" size={18} />
            </button>
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={() => list.add({ icon: "landscape", title: "", text: "" })}
        disabled={list.rows.length >= MAX_WHY_POINTS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add card
      </button>
      <FieldError id="why-points-error" message={errors.whyPoints} />
    </div>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { BADGE_ICONS, MAX_PHOTO_BADGES, TREK_LIMITS as LIMIT } from "../../constants";
import type { PhotoBadge } from "../../types";

type PhotoBadgesCardProps = {
  badges: PhotoBadge[];
  errors: FieldErrors;
  onEdit: () => void;
};

type BadgeRow = PhotoBadge & { id: string };

const TONES = [
  { value: "brand", label: "Blue" },
  { value: "green", label: "Green" },
];

/** Up to 3 selling points on the main photo, e.g. "No flights needed". Sent as badgeLabel/badgeIcon/badgeTone. */
export const PhotoBadgesCard = ({ badges, errors, onEdit }: PhotoBadgesCardProps) => {
  const [rows, setRows] = useState<BadgeRow[]>(() => badges.map((badge, index) => ({ ...badge, id: `saved-${index}` })));

  const update = (next: BadgeRow[]) => {
    setRows(next);
    onEdit();
  };

  return (
    <FormSection
      title="Badges on the main photo"
      hint={`Up to ${MAX_PHOTO_BADGES} short selling points.`}
      aside={
        <button
          type="button"
          onClick={() => update([...rows, { id: crypto.randomUUID(), label: "", icon: "route", tone: "brand" }])}
          disabled={rows.length >= MAX_PHOTO_BADGES}
          className={cn(secondaryButton, "min-h-8 px-3 text-caption")}
        >
          <Icon name="add" size={16} />
          Add badge
        </button>
      }
    >
      {rows.length ? (
        rows.map((row, index) => (
          <div key={row.id} className="grid items-start gap-2 rounded-xl border border-solid border-border bg-page p-2.5 tablet:grid-cols-[minmax(0,1fr)_150px_110px_auto]">
            <TextField
              name="badgeLabel"
              label={`Badge ${index + 1}`}
              defaultValue={row.label}
              placeholder="e.g. No flights needed"
              error={errors[`photoBadges.${index}.label`]}
              maxLength={LIMIT.badgeLabel}
            />
            <SelectField name="badgeIcon" label="Icon" options={BADGE_ICONS} defaultValue={row.icon} error={errors[`photoBadges.${index}.icon`]} />
            <SelectField name="badgeTone" label="Color" options={TONES} defaultValue={row.tone} />
            <button
              type="button"
              className={cn(ghostIconButton, "tablet:mt-6")}
              aria-label={`Remove badge ${index + 1}`}
              onClick={() => update(rows.filter((other) => other.id !== row.id))}
            >
              <Icon name="delete" size={18} />
            </button>
          </div>
        ))
      ) : (
        <p className="m-0 text-caption text-muted-foreground">No badges. The main photo shows without them.</p>
      )}
      <FieldError id="photo-badges-error" message={errors.photoBadges} />
    </FormSection>
  );
};

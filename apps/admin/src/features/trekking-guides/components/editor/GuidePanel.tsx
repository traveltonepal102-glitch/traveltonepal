"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { iconButton, primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";

import { GUIDE_LIMITS as LIMIT, TREKKING_GUIDES_PATH } from "../../constants";
import type { TrekkingGuide, TrekkingGuideValues } from "../../types";
import { GuideDetailsFields } from "./GuideDetailsFields";
import { GuideLicenceFields } from "./GuideLicenceFields";
import { GuidePhotoField } from "./GuidePhotoField";
import { GuideVisibilityFields } from "./GuideVisibilityFields";
import { LanguagesField } from "./LanguagesField";
import { RemoveGuideButton } from "./RemoveGuideButton";

type GuidePanelProps = {
  /** saveTrekkingGuide bound to this guide's id (null for a new guide). */
  action: EditorSaveAction;
  /** The saved guide; null for a new one. */
  guide: TrekkingGuide | null;
  values: TrekkingGuideValues;
  regions: { id: string; name: string }[];
  /** "YYYY-MM-DD" in Nepal. */
  today: string;
  canRemove: boolean;
  isJustAdded: boolean;
};

const STATUS_TONE = { saved: "text-whatsapp", unsaved: "text-saffron-ink", neutral: "text-muted-foreground" } as const;

/**
 * Add or edit one guide, beside the list (design: the edit drawer; full screen on phones and tablets).
 * One Save sends everything. Closing is a link back to the list.
 */
export const GuidePanel = ({ action, guide, values, regions, today, canRemove, isJustAdded }: GuidePanelProps) => {
  const form = useEditorForm<"guide">({
    action,
    firstKey: "guide",
    firstSectionWithError: () => undefined,
    isNew: !guide,
    addedLabel: isJustAdded ? "Guide added" : undefined,
  });
  const { errors, markDirty } = form;
  const [status, tone] = form.saveStatus;

  return (
    <aside
      aria-label={guide ? `Edit ${guide.name}` : "Add trekking guide"}
      className="flex flex-col overflow-hidden rounded-lg border border-solid border-border bg-surface max-desktop:fixed max-desktop:inset-0 max-desktop:z-50 max-desktop:rounded-none desktop:sticky desktop:top-21 desktop:max-h-[calc(100dvh-6.5rem)]"
    >
      <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">{guide ? "Edit trekking guide" : "New trekking guide"}</p>
            <h2 className="m-0 truncate font-display text-h4 text-ink">{guide?.name ?? "Add trekking guide"}</h2>
            <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
              {status}
            </p>
          </div>
          <Link href={TREKKING_GUIDES_PATH} scroll={false} aria-label="Close" className={iconButton}>
            <Icon name="close" size={20} />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <GuidePhotoField initial={guide?.photo ?? null} name={values.name} onEdit={markDirty} />
          <GuideDetailsFields values={values} regions={regions} errors={errors} />
          <GuideLicenceFields values={values} today={today} errors={errors} />
          <LanguagesField initial={values.languages} error={errors.languages} onEdit={markDirty} />
          <TextField
            name="bio"
            label="Short bio"
            hint="Shown on the About page, trek pages and under articles."
            multiline
            rows={4}
            defaultValue={values.bio}
            maxLength={LIMIT.bio}
            showCount
            error={errors.bio}
          />
          <TextField
            name="quote"
            label="A line in their own words"
            labelNote="(optional)"
            defaultValue={values.quote}
            placeholder="“What I love most about this trail is…”"
            maxLength={LIMIT.quote}
            error={errors.quote}
          />
          <GuideVisibilityFields values={values} treks={guide?.treks ?? []} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-5 py-3">
          {guide && canRemove && <RemoveGuideButton guideId={guide.id} name={guide.name} trekCount={guide.treks.length} />}
          <span className="flex-1" />
          <Link href={TREKKING_GUIDES_PATH} scroll={false} className={secondaryButton}>
            Cancel
          </Link>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : guide ? "Save changes" : "Add guide"}
          </button>
        </div>
      </form>
    </aside>
  );
};

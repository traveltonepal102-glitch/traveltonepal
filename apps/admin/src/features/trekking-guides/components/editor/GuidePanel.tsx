"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { SideDrawer } from "@/components/ui/SideDrawer";
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
 * Add or edit one guide in a drawer over the list (design: the edit drawer; full screen on phones and tablets).
 * One Save sends everything. Closing goes back to the list, after asking when there are unsaved changes.
 */
export const GuidePanel = ({ action, guide, values, regions, today, canRemove, isJustAdded }: GuidePanelProps) => {
  const form = useEditorForm<"guide">({
    action,
    firstKey: "guide",
    firstSectionWithError: () => undefined,
    isNew: !guide,
    addedLabel: isJustAdded ? "Guide added" : undefined,
  });
  const router = useRouter();
  const { errors, markDirty } = form;
  const [status, tone] = form.saveStatus;

  const close = () => {
    if (form.isDirty && !window.confirm("Close without saving? Your changes to this guide will be lost.")) return;
    router.push(TREKKING_GUIDES_PATH, { scroll: false });
  };

  return (
    <SideDrawer
      kicker={guide ? "Edit trekking guide" : "New trekking guide"}
      title={guide?.name ?? "Add trekking guide"}
      status={
        <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
          {status}
        </p>
      }
      onClose={close}
    >
      <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
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

        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          {guide && canRemove && <RemoveGuideButton guideId={guide.id} name={guide.name} trekCount={guide.treks.length} />}
          <span className="flex-1" />
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : guide ? "Save changes" : "Add guide"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};

"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { TextField } from "@/components/ui/TextField";

import { GUIDE_LIMITS as LIMIT, TREKKING_GUIDES_PATH } from "../../constants";
import { useGuideDraft } from "../../hooks/useGuideDraft";
import { guideCardView } from "../../lib/guideCard";
import type { TrekkingGuide, TrekkingGuideValues } from "../../types";
import { GuideAboutFields } from "./GuideAboutFields";
import { GuideCardPreview } from "./GuideCardPreview";
import { GuideFormGroup } from "./GuideFormGroup";
import { GuideLicenceFields } from "./GuideLicenceFields";
import { GuideVisibilityFields } from "./GuideVisibilityFields";
import { PhotoAndNameFields } from "./PhotoAndNameFields";
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
  const { draft, readForm, setLanguages, setPhoto } = useGuideDraft({ ...values, photo: guide?.photo ?? null });
  const firstRegion = regions.find((region) => draft.regionIds.includes(region.id));

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
      <form
        noValidate
        onSubmit={form.handleSubmit}
        onChange={(event) => {
          markDirty();
          readForm(event);
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <GuideCardPreview view={guideCardView(draft, firstRegion?.name, today)} name={draft.name} role={draft.role} quote={draft.quote} languages={draft.languages} photo={draft.photo} />
          <PhotoAndNameFields
            photo={guide?.photo ?? null}
            name={values.name}
            photoConsent={values.photoConsent}
            typedName={draft.name}
            errors={errors}
            onEdit={markDirty}
            onPhotoChange={setPhoto}
          />
          <GuideAboutFields values={values} errors={errors} onEdit={markDirty} onLanguagesChange={setLanguages} />
          <GuideLicenceFields values={values} today={today} errors={errors} />
          {regions.length > 0 && (
            <GuideFormGroup title="Regions this guide leads">
              <ChoiceChips legend="Pick one or more" name="regionId" type="checkbox" options={regions.map((region) => ({ value: region.id, label: region.name }))} defaultValues={values.regionIds} error={errors.regionIds} />
              <span className="text-xs text-muted-foreground">Suggests this guide on treks in these regions and shows them on those region pages.</span>
            </GuideFormGroup>
          )}
          <GuideFormGroup title="Short bio">
            <TextField
              name="bio"
              label="English"
              hint="Shown when this guide writes or checks a travel guide. German comes with the German website."
              multiline
              rows={3}
              defaultValue={values.bio}
              maxLength={LIMIT.bio}
              showCount
              error={errors.bio}
            />
          </GuideFormGroup>
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

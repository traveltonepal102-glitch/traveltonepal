"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { SideDrawer } from "@/components/ui/SideDrawer";
import type { Photo } from "@/features/photos/types";

import { removeAdventure } from "../actions/removeAdventure";
import { ADVENTURES_PATH } from "../constants";
import type { Adventure, AdventureValues } from "../types";
import { AdventureFields } from "./AdventureFields";

type AdventurePanelProps = {
  /** saveAdventure bound to this adventure's id (null for a new one). */
  action: EditorSaveAction;
  /** The saved adventure; null for a new one. */
  adventure: Adventure | null;
  values: AdventureValues;
  libraryPhotos: Photo[];
  canRemove: boolean;
};

const STATUS_TONE = { saved: "text-whatsapp", unsaved: "text-saffron-ink", neutral: "text-muted-foreground" } as const;

/** Add or edit one adventure in a drawer over the list. One Save sends everything and closes the drawer. */
export const AdventurePanel = ({ action, adventure, values, libraryPhotos, canRemove }: AdventurePanelProps) => {
  const form = useEditorForm<"adventure">({
    action,
    firstKey: "adventure",
    firstSectionWithError: () => undefined,
    isNew: !adventure,
  });
  const router = useRouter();
  const [status, tone] = form.saveStatus;
  const title = adventure ? adventure.title : "Add adventure";

  const close = () => {
    if (form.isDirty && !window.confirm("Close without saving? Your changes to this adventure will be lost.")) return;
    router.push(ADVENTURES_PATH, { scroll: false });
  };

  return (
    <SideDrawer
      kicker={adventure ? "Edit adventure" : "New adventure"}
      title={title}
      status={
        <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
          {status}
        </p>
      }
      onClose={close}
    >
      <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <AdventureFields values={values} photo={adventure?.photo ?? null} libraryPhotos={libraryPhotos} errors={form.errors} onEdit={form.markDirty} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          {adventure && canRemove && <ConfirmRemoveButton name={adventure.title} action={removeAdventure.bind(null, adventure.id)} />}
          <span className="flex-1" />
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : adventure ? "Save changes" : "Add adventure"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};

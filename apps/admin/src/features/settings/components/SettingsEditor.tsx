"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { SAVE_STATUS_DOT } from "@/components/editor/EditorHeader";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { SiteSettings } from "../types";
import { CompanySettingsCard } from "./CompanySettingsCard";
import { ContactSettingsCard } from "./ContactSettingsCard";
import { SocialSettingsCard } from "./SocialSettingsCard";

type SettingsEditorProps = {
  action: EditorSaveAction;
  settings: SiteSettings;
  /** Only a Super admin may save. */
  canEdit: boolean;
  /** e.g. "Saved 23 Oct, 11:32". */
  lastSaved?: string;
};

const SECTION = ADMIN_SECTIONS.settings;

/**
 * Site settings: contact details, company and licences, social links. One form, one Save. A main screen, so it has
 * the same heading as the other main screens (no "back" bar like an item's editor).
 */
export const SettingsEditor = ({ action, settings, canEdit, lastSaved }: SettingsEditorProps) => {
  const form = useEditorForm({ action, firstKey: "settings", firstSectionWithError: () => undefined, isNew: false, lastSaved });
  const [status, statusTone] = form.saveStatus;
  const { errors, markDirty } = form;

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex max-w-240 flex-col gap-5">
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name={SECTION.icon} size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{SECTION.label}</h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">{SECTION.summary}</p>
        </div>
        {canEdit && (
          <div className="flex flex-col items-end gap-1.5 max-tablet:w-full max-tablet:items-stretch">
            <button type="submit" disabled={form.isSaving} className={cn(primaryButton, "disabled:cursor-wait disabled:opacity-70")}>
              {form.isSaving ? "Saving…" : "Save settings"}
            </button>
            <p role="status" className="m-0 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span aria-hidden="true" className={cn("size-2 flex-none rounded-full", SAVE_STATUS_DOT[statusTone])} />
              {status}
            </p>
          </div>
        )}
      </div>
      {form.state.status === "error" && <FormAlert message={form.state.message} />}
      {!canEdit && (
        <p className="m-0 flex items-start gap-2.5 rounded-md bg-brand-tint px-3.5 py-3 text-ink">
          <Icon name="info" size={20} className="flex-none text-brand" />
          Only a Super admin can change these settings. You can see them here.
        </p>
      )}
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
        <ContactSettingsCard values={settings} errors={errors} onEdit={markDirty} />
        <CompanySettingsCard values={settings} certificate={settings.certificatePhoto} panCertificate={settings.panCertificatePhoto} errors={errors} onEdit={markDirty} />
        <SocialSettingsCard values={settings} sharePhoto={settings.sharePhoto} errors={errors} onEdit={markDirty} />
      </fieldset>
    </form>
  );
};

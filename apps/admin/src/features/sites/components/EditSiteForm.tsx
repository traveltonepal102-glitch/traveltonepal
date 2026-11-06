"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormSection } from "@/components/ui/FormSection";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";

import { SITE_LIMITS as LIMIT, SITES_PATH } from "../constants";
import type { Site } from "../types";
import { SitesHeading } from "./SitesHeading";

type EditSiteFormProps = {
  /** saveSite bound to this site's id. */
  action: EditorSaveAction;
  site: Site;
  /** The region site's region; null for the main site. */
  regionName: string | null;
  /** Only a Super admin may save. */
  canEdit: boolean;
};

/** A site's edit page: its name, address and "Live" switch. The site id and region are shown but never change. */
export const EditSiteForm = ({ action, site, regionName, canEdit }: EditSiteFormProps) => {
  const form = useEditorForm({ action, firstKey: "site", firstSectionWithError: () => undefined, isNew: false });
  const { errors, markDirty } = form;
  const isMain = site.kind === "main";

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex flex-col gap-4">
      <SitesHeading
        title={site.name}
        summary={isMain ? "The main website. It is always live and can't be deleted." : `The region website for ${regionName ?? "its region"}.`}
        actions={
          <div className="flex gap-2 max-tablet:w-full">
            <Link href={SITES_PATH} className={secondaryButton}>
              Back to sites
            </Link>
            {canEdit && (
              <button type="submit" disabled={form.isSaving} className={cn(primaryButton, "disabled:cursor-wait disabled:opacity-70 max-tablet:flex-1")}>
                {form.isSaving ? "Saving…" : "Save site"}
              </button>
            )}
          </div>
        }
      />
      {form.state.status === "error" && <FormAlert message={form.state.message} />}
      {!canEdit && (
        <p className="m-0 flex items-start gap-2.5 rounded-md bg-brand-tint px-3.5 py-3 text-ink">
          <Icon name="info" size={20} className="flex-none text-brand" />
          Only a Super admin can change a site. You can see it here.
        </p>
      )}

      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
        <FormSection title="The website">
          <TextField name="name" label="Website name" defaultValue={site.name} maxLength={LIMIT.name} hint="The brand name in the header, the footer and Google's results." error={errors.name} />
          <div className="grid gap-3 tablet:grid-cols-2">
            <TextField name="siteId" label="Site id" defaultValue={site.id} isReadOnly hint="SITE_ID in the site's Vercel project. Never changes." />
            <TextField name="region" label="Region" defaultValue={isMain ? "All regions (main site)" : (regionName ?? "")} isReadOnly hint="Never changes." />
          </div>
        </FormSection>

        <FormSection title="Address and Live">
          <TextField
            name="url"
            label="Website address"
            labelNote={isMain ? undefined : "(optional while a draft)"}
            defaultValue={site.url ?? ""}
            placeholder="https://manaslutrek.com"
            inputMode="url"
            hint="The address only, without a page, once the domain points to the site's Vercel project."
            error={errors.url}
          />
          {isMain ? (
            <p className="m-0 text-body-sm text-muted-foreground">The main site is always live.</p>
          ) : (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">Live</span>
                <span className="block text-xs text-muted-foreground">
                  On: Google may show the site. Off: a draft that Google is told to skip. A live site can&apos;t be deleted.
                </span>
              </span>
              <Switch name="isLive" label="Live" defaultChecked={site.isLive} />
            </label>
          )}
        </FormSection>
      </fieldset>
    </form>
  );
};

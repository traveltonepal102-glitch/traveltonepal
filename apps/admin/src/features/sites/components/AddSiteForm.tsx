"use client";

import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";

import { SITE_LIMITS as LIMIT, SITES_PATH } from "../constants";
import { AddSiteNextSteps } from "./AddSiteNextSteps";
import { SitesHeading } from "./SitesHeading";

type AddSiteFormProps = {
  action: EditorSaveAction;
  /** Regions that don't have a website yet. */
  regions: { value: string; label: string }[];
};

/** "Add a site" (design: Admin-AddSite.dc.html): a new region site, a draft until its domain is set up. */
export const AddSiteForm = ({ action, regions }: AddSiteFormProps) => {
  const form = useEditorForm({ action, firstKey: "site", firstSectionWithError: () => undefined, isNew: true });
  const { errors, markDirty } = form;

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex max-w-240 flex-col gap-5">
      <SitesHeading
        title="Add a site"
        summary="A new region website starts as a draft that Google is told to skip. You write its pages here; the developer gives it its design and Vercel project."
        actions={
          <div className="flex gap-2 max-tablet:w-full">
            <Link href={SITES_PATH} className={secondaryButton}>
              Cancel
            </Link>
            <button type="submit" disabled={form.isSaving} className={cn(primaryButton, "disabled:cursor-wait disabled:opacity-70 max-tablet:flex-1")}>
              {form.isSaving ? "Adding…" : "Add site"}
            </button>
          </div>
        }
      />
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-4 desktop:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <FormSection title="The website" hint="What visitors and Google see, and the region it is about.">
            <TextField name="name" label="Website name" placeholder="Manaslu Trek" maxLength={LIMIT.name} hint="The brand name in the header, the footer and Google's results." error={errors.name} />
            <SelectField
              name="regionId"
              label="Region"
              placeholder={regions.length > 0 ? "Pick the region" : "Every region already has a website"}
              options={regions}
              hint="One website per region. Its treks are copied from Travel To Nepal's treks in this region."
              error={errors.regionId}
            />
            <TextField
              name="id"
              label="Site id"
              placeholder="manaslu"
              maxLength={LIMIT.id}
              hint="Lowercase letters, numbers and dashes. It becomes SITE_ID in the site's Vercel project and can't be changed later."
              error={errors.id}
            />
          </FormSection>

          <FormSection title="Address" hint="Can be added later, once the domain points to the site's Vercel project.">
            <TextField
              name="url"
              label="Website address"
              labelNote="(optional)"
              placeholder="https://manaslutrek.com"
              inputMode="url"
              hint="The address only, without a page. The site stays a draft (hidden from Google) until it is switched live."
              error={errors.url}
            />
          </FormSection>
        </div>
        <AddSiteNextSteps />
      </div>
    </form>
  );
};

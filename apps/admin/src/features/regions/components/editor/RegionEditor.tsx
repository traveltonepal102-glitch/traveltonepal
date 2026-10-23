"use client";

import { useState } from "react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSectionNav } from "@/components/editor/EditorSectionNav";
import { PendingSection } from "@/components/editor/PendingSection";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import { CoverAndGallery } from "@/features/photos/components/CoverAndGallery";

import { REGIONS_PATH } from "../../constants";
import { getRegionReadiness } from "../../lib/readiness";
import { REGION_SECTIONS, firstSectionWithError, sectionsWithErrors } from "../../sections";
import type { RegionPhotos, RegionSectionKey, RegionValues } from "../../types";
import { BasicsSection } from "./BasicsSection";
import { FactsSection } from "./FactsSection";
import { FaqSection } from "./FaqSection";
import { MonthsSection } from "./MonthsSection";
import { SeoSection } from "./SeoSection";

type RegionEditorProps = {
  /** saveRegion bound to this region's id (null for a new region). */
  action: EditorSaveAction;
  /** The saved values (empty for a new region). */
  values: RegionValues;
  photos: RegionPhotos;
  /** null for a new region. */
  regionId: string | null;
  isNew: boolean;
  websiteDomain: string | null;
  /** e.g. "Saved 23 Oct, 11:32" (formatted on the server, so it matches the admin's time zone setting). */
  lastSaved?: string;
  isJustAdded?: boolean;
};

/**
 * Add or edit a region (design: Admin-region-editor). All sections are one form: switching sections keeps
 * what you typed, and Save sends everything. Nothing is saved until Save.
 */
export const RegionEditor = ({
  action,
  values,
  photos,
  regionId,
  isNew,
  websiteDomain,
  lastSaved,
  isJustAdded = false,
}: RegionEditorProps) => {
  const form = useEditorForm<RegionSectionKey>({
    action,
    firstKey: "basics",
    firstSectionWithError,
    isNew,
    lastSaved,
    addedLabel: isJustAdded ? "Region added" : undefined,
  });
  const [slug, setSlug] = useState(values.slug);
  const { errors, activeKey, markDirty } = form;
  const [status, statusTone] = form.saveStatus;
  const photosError = Object.entries(errors).find(([field]) => field.startsWith("photos"))?.[1];
  const active = REGION_SECTIONS.find((section) => section.key === activeKey) ?? REGION_SECTIONS[0];

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex flex-col gap-5">
      <EditorHeader
        back={{ href: REGIONS_PATH, label: "Regions" }}
        title={isNew ? "New region" : `${values.name} region`}
        status={status}
        statusTone={statusTone}
        saveLabel={isNew ? "Add region" : "Save changes"}
        isSaving={form.isSaving}
      />
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-6 desktop:grid-cols-[260px_minmax(0,1fr)]">
        <EditorSectionNav
          label="Region sections"
          progressTitle="Region page ready"
          sections={REGION_SECTIONS}
          activeKey={activeKey}
          onSelect={form.setActiveKey}
          readiness={getRegionReadiness(values, photos)}
          errorKeys={sectionsWithErrors(Object.keys(errors))}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <h2 className="m-0 font-display text-[26px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{active.label}</h2>
            <p className="m-0 max-w-170 text-muted-foreground">{active.description}</p>
          </div>

          <div hidden={activeKey !== "basics"} className="flex flex-col gap-4">
            <BasicsSection
              values={values}
              errors={errors}
              isNew={isNew}
              websiteDomain={websiteDomain}
              slug={slug}
              onSlugChange={setSlug}
              onEdit={markDirty}
            />
          </div>
          <div hidden={activeKey !== "photos"} className="flex flex-col gap-4">
            <CoverAndGallery
              initial={photos}
              regionId={regionId}
              subject={`${values.name || "This"} region`}
              onEdit={markDirty}
              error={photosError}
            />
          </div>
          <div hidden={activeKey !== "facts"}>
            <FactsSection values={values} errors={errors} />
          </div>
          <div hidden={activeKey !== "months"} className="flex flex-col gap-4">
            <MonthsSection values={values} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "faq"}>
            <FaqSection faqs={values.faqs} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "seo"}>
            <SeoSection values={values} errors={errors} slug={slug} />
          </div>
          {active.waitsFor && <PendingSection waitsFor={active.waitsFor} />}
        </div>
      </div>
    </form>
  );
};

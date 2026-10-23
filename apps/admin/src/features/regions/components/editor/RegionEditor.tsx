"use client";

import { startTransition, useActionState, useState } from "react";
import type { FormEvent } from "react";

import { FormAlert } from "@/components/ui/FormAlert";
import { CoverAndGallery } from "@/features/photos/components/CoverAndGallery";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";

import type { SaveRegionState } from "../../actions/saveRegion";
import { getRegionReadiness } from "../../lib/readiness";
import { REGION_SECTIONS, firstSectionWithError, sectionsWithErrors } from "../../sections";
import type { RegionPhotos, RegionSectionKey, RegionValues } from "../../types";
import { BasicsSection } from "./BasicsSection";
import { FactsSection } from "./FactsSection";
import { FaqSection } from "./FaqSection";
import { MonthsSection } from "./MonthsSection";
import { PendingSection } from "./PendingSection";
import { RegionEditorHeader } from "./RegionEditorHeader";
import type { SaveStatusTone } from "./RegionEditorHeader";
import { RegionSectionNav } from "./RegionSectionNav";
import { SeoSection } from "./SeoSection";

type RegionEditorProps = {
  /** saveRegion bound to this region's id (null for a new region). */
  action: (state: SaveRegionState, formData: FormData) => Promise<SaveRegionState>;
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

const IDLE: SaveRegionState = { status: "idle" };

type SaveStatusInput = Pick<RegionEditorProps, "isNew" | "lastSaved" | "isJustAdded"> & {
  isDirty: boolean;
  state: SaveRegionState;
};

/** The line under the region name: what has been saved. */
const getSaveStatus = ({ isDirty, state, isNew, isJustAdded, lastSaved }: SaveStatusInput): [string, SaveStatusTone] => {
  if (isDirty) return ["Unsaved changes", "unsaved"];
  if (state.status === "saved") return ["Saved just now", "saved"];
  if (isNew) return ["Not saved yet", "neutral"];
  if (isJustAdded) return ["Region added", "saved"];
  return [lastSaved ?? "Saved", "saved"];
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
  const [state, formAction, isSaving] = useActionState(action, IDLE);
  const [activeKey, setActiveKey] = useState<RegionSectionKey>("basics");
  const [slug, setSlug] = useState(values.slug);
  const [isDirty, setIsDirty] = useState(false);
  const [handledState, setHandledState] = useState(state);
  useUnsavedChangesWarning(isDirty);

  // React to a finished save once: clear "unsaved", or open the first section with a problem.
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "saved") setIsDirty(false);
    if (state.status === "error") setActiveKey((key) => firstSectionWithError(Object.keys(state.fieldErrors)) ?? key);
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const photosError = Object.entries(errors).find(([field]) => field.startsWith("photos"))?.[1];
  const active = REGION_SECTIONS.find((section) => section.key === activeKey) ?? REGION_SECTIONS[0];
  const markDirty = () => setIsDirty(true);

  const [status, statusTone] = getSaveStatus({ isDirty, state, isNew, isJustAdded, lastSaved });

  // Not <form action>: React would reset the fields after each save.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form noValidate onSubmit={handleSubmit} onChange={markDirty} className="flex flex-col gap-5">
      <RegionEditorHeader
        title={isNew ? "New region" : `${values.name} region`}
        status={isSaving ? "Saving…" : status}
        statusTone={statusTone}
        saveLabel={isNew ? "Add region" : "Save changes"}
        isSaving={isSaving}
      />
      {state.status === "error" && <FormAlert message={state.message} />}

      <div className="grid items-start gap-6 desktop:grid-cols-[260px_minmax(0,1fr)]">
        <RegionSectionNav
          activeKey={activeKey}
          onSelect={setActiveKey}
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

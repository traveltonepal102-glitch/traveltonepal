"use client";

import { useState } from "react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSectionHeading } from "@/components/editor/EditorSectionHeading";
import { EditorSectionLinks } from "@/components/editor/EditorSectionLinks";
import { EditorSectionNav } from "@/components/editor/EditorSectionNav";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import type { GuideOption } from "@/features/trekking-guides/lib/guideOptions";

import { TREKS_PATH } from "../../constants";
import { getTrekReadiness } from "../../lib/readiness";
import { firstSectionWithError, sectionsWithErrors, trekSectionsInPageOrder } from "../../sections";
import type { RegionOption, SimilarTrekOption, TrekPhotos, TrekSectionKey, TrekValues } from "../../types";
import { TrekSectionPanels } from "./TrekSectionPanels";
import { TrekStatusSelect } from "./TrekStatusSelect";

type TrekEditorProps = {
  /** saveTrek bound to this trek's id (null for a new trek). */
  action: EditorSaveAction;
  values: TrekValues;
  photos: TrekPhotos;
  regions: RegionOption[];
  /** Every other trek, to pick similar treks from. */
  similarOptions: SimilarTrekOption[];
  /** Every trekking guide, to pick the trek's guides from. */
  guideOptions: GuideOption[];
  /** The region's id, to tag new uploads (null when the trek has none yet). */
  regionId: string | null;
  isNew: boolean;
  /** Where the saved PDF map downloads from (null without one). */
  pdfMapUrl: string | null;
  lastSaved?: string;
  isJustAdded?: boolean;
};

/**
 * Add or edit a trek (design: Admin-trek-editor). All sections are one form: switching sections keeps what
 * you typed, and Save sends everything, including the status. Nothing is saved until Save.
 */
export const TrekEditor = ({ action, values, photos, regions, similarOptions, guideOptions, regionId, isNew, pdfMapUrl, lastSaved, isJustAdded = false }: TrekEditorProps) => {
  const form = useEditorForm<TrekSectionKey>({
    action,
    firstKey: "top",
    firstSectionWithError,
    isNew,
    lastSaved,
    addedLabel: isJustAdded ? "Trek added" : undefined,
  });
  const { errors, activeKey, markDirty } = form;
  const [status, statusTone] = form.saveStatus;
  // Kept here so the section list follows the page's order as it is changed.
  const [sectionOrder, setSectionOrder] = useState(values.sectionOrder);
  const sections = trekSectionsInPageOrder(sectionOrder);
  const active = sections.find((section) => section.key === activeKey) ?? sections[0];
  const changeSectionOrder = (order: typeof sectionOrder) => {
    setSectionOrder(order);
    markDirty();
  };

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex flex-col gap-5">
      <EditorHeader
        back={{ href: TREKS_PATH, label: "Treks" }}
        title={isNew ? "New trek" : values.name}
        status={status}
        statusTone={statusTone}
        saveLabel={isNew ? "Add trek" : "Save changes"}
        isSaving={form.isSaving}
      >
        <TrekStatusSelect defaultValue={values.status} />
      </EditorHeader>
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-6 desktop:grid-cols-[260px_minmax(0,1fr)]">
        <EditorSectionNav
          label="Trek sections"
          progressTitle="Ready to publish"
          sections={sections}
          activeKey={activeKey}
          onSelect={form.setActiveKey}
          readiness={getTrekReadiness(values, photos)}
          errorKeys={sectionsWithErrors(Object.keys(errors))}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <EditorSectionHeading section={active} name={values.name} />

          <EditorSectionLinks sections={sections} onShow={form.setActiveKey}>
            <TrekSectionPanels
              activeKey={activeKey}
              values={values}
              photos={photos}
              errors={errors}
              onEdit={markDirty}
              regions={regions}
              similarOptions={similarOptions}
              guideOptions={guideOptions}
              regionId={regionId}
              isNew={isNew}
              pdfMapUrl={pdfMapUrl}
              sectionOrder={sectionOrder}
              onSectionOrderChange={changeSectionOrder}
            />
          </EditorSectionLinks>
        </div>
      </div>
    </form>
  );
};

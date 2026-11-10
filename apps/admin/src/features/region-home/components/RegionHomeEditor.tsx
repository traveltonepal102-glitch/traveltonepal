"use client";

import { useState } from "react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import { PageGoogleCard } from "@/features/pages/components/PageGoogleCard";
import { PAGES_PATH } from "@/features/pages/constants";
import type { PageTopValues } from "@/features/pages/types";
import type { Photo } from "@/features/photos/types";

import type { HomeTopContent, HomeTrekOption } from "../types";
import { HomeTopCard } from "./HomeTopCard";
import { HomeTrekCard } from "./HomeTrekCard";

type RegionHomeEditorProps = {
  action: EditorSaveAction;
  /** e.g. "Manaslu Trek". */
  siteName: string;
  /** The website's region: new photo uploads are tagged with it. */
  regionId: string | null;
  treks: HomeTrekOption[];
  homeTrekId: string | null;
  top: PageTopValues & HomeTopContent;
  photo: Photo | null;
  sharePhoto: Photo | null;
  lastSaved: string;
};

/**
 * A region website's Home (decided 2026-11-04): its main trek, the top of the page (required fields first, like a
 * travel guide's) and how the page shows on Google. The rest of the page is the main trek. One form, one Publish.
 */
export const RegionHomeEditor = ({ action, siteName, regionId, treks, homeTrekId, top, photo: initialPhoto, sharePhoto, lastSaved }: RegionHomeEditorProps) => {
  const form = useEditorForm({ action, firstKey: "home", firstSectionWithError: () => undefined, isNew: false, lastSaved });
  const [photo, setPhoto] = useState(initialPhoto);
  const [status, statusTone] = form.saveStatus;

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex flex-col gap-5">
      <EditorHeader back={{ href: PAGES_PATH, label: "Pages" }} title={`Home page · ${siteName}`} status={status} statusTone={statusTone} saveLabel="Publish" isSaving={form.isSaving} isDirty={form.isDirty} saveState={form.state} />
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="flex max-w-215 flex-col gap-4">
        <HomeTopCard
          values={top}
          photo={photo}
          regionId={regionId}
          errors={form.errors}
          onPhotoChange={(next) => {
            setPhoto(next);
            form.markDirty();
          }}
        />
        <HomeTrekCard treks={treks} homeTrekId={homeTrekId} errors={form.errors} />
        <PageGoogleCard values={top} errors={form.errors} websitePath="/" sharePhoto={sharePhoto} shareFallback="the photo at the top of the page" onEdit={form.markDirty} canHide={false} />
      </div>
    </form>
  );
};

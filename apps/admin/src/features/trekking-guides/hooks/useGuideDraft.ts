"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { Photo } from "@/features/photos/types";

import { draftFromForm } from "../lib/guideDraft";
import type { GuideDraft } from "../lib/guideDraft";

type GuideDraftState = GuideDraft & { languages: string[]; photo: Photo | null };

/**
 * The guide as typed so far, for the card preview. Typed fields are read from the form on each change;
 * languages and the photo come from their own fields (they change without a form event).
 */
export const useGuideDraft = (initial: GuideDraftState) => {
  const [draft, setDraft] = useState(initial);

  return {
    draft,
    readForm: (event: FormEvent<HTMLFormElement>) => {
      const fields = draftFromForm(new FormData(event.currentTarget));
      setDraft((current) => ({ ...current, ...fields }));
    },
    setLanguages: (languages: string[]) => setDraft((current) => ({ ...current, languages })),
    setPhoto: (photo: Photo | null) => setDraft((current) => ({ ...current, photo })),
  };
};

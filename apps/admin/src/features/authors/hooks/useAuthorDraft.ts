"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { Photo } from "@/features/photos/types";

import { draftFromAuthorForm } from "../lib/authorDraft";
import type { AuthorDraft } from "../lib/authorDraft";

type AuthorDraftState = AuthorDraft & { photo: Photo | null };

/** The author as typed so far, for the preview: typed fields from the form on each change, the photo from its field. */
export const useAuthorDraft = (initial: AuthorDraftState) => {
  const [draft, setDraft] = useState(initial);

  return {
    draft,
    readForm: (event: FormEvent<HTMLFormElement>) => {
      const fields = draftFromAuthorForm(new FormData(event.currentTarget));
      setDraft((current) => ({ ...current, ...fields }));
    },
    setPhoto: (photo: Photo | null) => setDraft((current) => ({ ...current, photo })),
  };
};

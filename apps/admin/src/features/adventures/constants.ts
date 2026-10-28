import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { AdventureValues } from "./types";

export const ADVENTURES_PATH = ADMIN_SECTIONS.adventures.href;
/** The list with an adventure's edit panel open (the panel lives on the list, like Reviews). */
export const adventurePath = (adventureId: string) => `${ADVENTURES_PATH}?adventure=${adventureId}`;
export const NEW_ADVENTURE_PATH = adventurePath("new");

/** What the list says after the panel closed ("?saved=…"). */
export const SAVED_NOTICES = { added: "Adventure added.", changed: "Adventure saved.", removed: "Adventure removed." } as const;

export type SavedNotice = keyof typeof SAVED_NOTICES;

/** The list after a save or removal, with its note. */
export const adventuresSavedPath = (notice: SavedNotice) => `${ADVENTURES_PATH}?saved=${notice}`;

/** Hard limits, the same as the database checks (supabase/migrations/20261028110000_custom_adventures.sql). */
export const ADVENTURE_LIMITS = { title: 60, tag: 40, summary: 240, photoAlt: 160, position: 99 } as const;

export const SECTION_LIMITS = { eyebrow: 60, heading: 120, intro: 400, askTitle: 60, askText: 240, stepsTitle: 60, stepTitle: 60, stepText: 200, note: 300 } as const;

/** "How it works" always has three steps. */
export const STEP_COUNT = 3;

/** A new card: hidden until it has a photo, last in the carousel (`position` is filled in from the list). */
export const EMPTY_ADVENTURE_VALUES: AdventureValues = {
  title: "",
  tag: "",
  summary: "",
  photoId: null,
  photoAlt: "",
  position: 1,
  isShown: false,
};

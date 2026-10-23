import type { IconName } from "@ttn/ui/icon";

import type { FieldErrors } from "@/lib/forms/fieldErrors";

/** One section of a content editor (region, trek…): the list on the left and the heading on the right. */
export type EditorSection<Key extends string> = {
  key: Key;
  label: string;
  icon: IconName;
  description: string;
  /** Sections that wait on another feature (e.g. "trekking guides"); shown as "Work in progress". */
  waitsFor?: string;
};

export type SectionStatus = "done" | "warn" | "todo";

export type SectionReadiness = { status: SectionStatus; note: string };

/** What an editor's save action returns (Server Action state for useActionState). */
export type EditorSaveState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string; fieldErrors: FieldErrors };

export type EditorSaveAction = (state: EditorSaveState, formData: FormData) => Promise<EditorSaveState>;

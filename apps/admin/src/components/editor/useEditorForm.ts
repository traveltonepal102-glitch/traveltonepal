"use client";

import { startTransition, useActionState, useState } from "react";
import type { FormEvent } from "react";

import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";

import type { EditorSaveAction, EditorSaveState } from "./types";

export type SaveStatusTone = "saved" | "unsaved" | "neutral";

type UseEditorFormOptions<Key extends string> = {
  action: EditorSaveAction;
  firstKey: Key;
  /** The first section with an error after a failed save. */
  firstSectionWithError: (fields: string[]) => Key | undefined;
  isNew: boolean;
  /** e.g. "Saved 23 Oct, 11:32" (formatted on the server). */
  lastSaved?: string;
  /** Shown right after adding, e.g. "Trek added". */
  addedLabel?: string;
};

const IDLE: EditorSaveState = { status: "idle" };

/**
 * The shared behaviour of a content editor: one form across all sections, Save through a Server Action,
 * "unsaved changes" tracking (with a warning before leaving), and opening the section that has an error.
 * Not <form action>: React would reset the fields after each save.
 */
export const useEditorForm = <Key extends string>({
  action,
  firstKey,
  firstSectionWithError,
  isNew,
  lastSaved,
  addedLabel,
}: UseEditorFormOptions<Key>) => {
  const [state, formAction, isSaving] = useActionState(action, IDLE);
  const [activeKey, setActiveKey] = useState<Key>(firstKey);
  const [isDirty, setIsDirty] = useState(false);
  const [handledState, setHandledState] = useState(state);
  useUnsavedChangesWarning(isDirty);

  // React to a finished save once: clear "unsaved", or open the first section with a problem.
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "saved") setIsDirty(false);
    if (state.status === "error") setActiveKey((key) => firstSectionWithError(Object.keys(state.fieldErrors)) ?? key);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const saveStatus = (): [string, SaveStatusTone] => {
    if (isSaving) return ["Saving…", "neutral"];
    if (isDirty) return ["Unsaved changes", "unsaved"];
    if (state.status === "saved") return ["Saved just now", "saved"];
    if (isNew) return ["Not saved yet", "neutral"];
    if (addedLabel) return [addedLabel, "saved"];
    return [lastSaved ?? "Saved", "saved"];
  };

  return {
    state,
    errors: state.status === "error" ? state.fieldErrors : {},
    isSaving,
    isDirty,
    activeKey,
    setActiveKey,
    markDirty: () => setIsDirty(true),
    handleSubmit,
    saveStatus: saveStatus(),
  };
};

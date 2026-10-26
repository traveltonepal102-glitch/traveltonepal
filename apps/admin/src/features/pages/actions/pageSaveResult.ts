import type { EditorSaveState } from "@/components/editor/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import type { z } from "zod";

import type { SavePageResult } from "../services/pagesRepository";

export const pageSaveFailure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

/** A form that didn't pass its checks: how many fields need fixing, and which. */
export const invalidPageForm = (error: z.ZodError): EditorSaveState => {
  const fieldErrors = toFieldErrors(error);
  const count = Object.keys(fieldErrors).length;
  return pageSaveFailure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
};

const FAILURE_MESSAGES: Record<Exclude<SavePageResult, { ok: true }>["reason"], string> = {
  forbidden: "You can't change this page. Ask a Super admin.",
  missing_photo: "A photo no longer exists. Reload the page and pick it again.",
  founder: "The founder must be an office author. Pick them again.",
  failed: "The page couldn't be saved. Nothing was lost on this page: try Save again in a moment.",
};

export const failedPageSave = (result: Exclude<SavePageResult, { ok: true }>): EditorSaveState => pageSaveFailure(FAILURE_MESSAGES[result.reason]);

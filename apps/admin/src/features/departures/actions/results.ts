import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { DepartureFailure } from "../services/departuresRepository";

/** What the Departure dates actions return to the screen. */
export type DepartureActionResult = { ok: true; message: string } | { ok: false; message: string; fieldErrors?: FieldErrors };

export const FAILURE_MESSAGES: Record<DepartureFailure, string> = {
  date_taken: "This trek already has a date on that day.",
  missing_trek: "That trek no longer exists. Reload the page.",
  not_found: "This date no longer exists. Reload the page.",
  forbidden: "Your account can't make this change.",
  failed: "That couldn't be saved. Try again in a moment.",
};

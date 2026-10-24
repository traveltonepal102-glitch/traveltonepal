"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { TREKS_PATH } from "@/features/treks/constants";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { DEPARTURES_PATH } from "../constants";
import { departureSchema, readDepartureForm } from "../schemas/departureSchema";
import { saveDeparture as saveDepartureToDatabase } from "../services/departuresRepository";
import type { DepartureActionResult } from "./results";
import { FAILURE_MESSAGES } from "./results";

/**
 * "Add date" (departureId null) or "Edit". departureId comes from the browser, so it is checked here; access is
 * enforced by RLS. Adding a date switches on fixed dates for its trek.
 */
export const saveDeparture = async (departureId: string | null, formData: FormData): Promise<DepartureActionResult> => {
  await requireAdmin();
  if (departureId !== null && !z.uuid().safeParse(departureId).success) return { ok: false, message: FAILURE_MESSAGES.not_found };

  const parsed = departureSchema.safeParse(readDepartureForm(formData));
  if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };

  const result = await saveDepartureToDatabase(parsed.data, departureId);
  if (!result.ok) {
    const fieldErrors = result.reason === "date_taken" ? { startDate: FAILURE_MESSAGES.date_taken } : undefined;
    return { ok: false, message: FAILURE_MESSAGES[result.reason], fieldErrors };
  }

  revalidatePath(DEPARTURES_PATH);
  // Trek editors show the same dates.
  revalidatePath(TREKS_PATH, "layout");
  return { ok: true, message: departureId ? "Date saved." : "Date added." };
};

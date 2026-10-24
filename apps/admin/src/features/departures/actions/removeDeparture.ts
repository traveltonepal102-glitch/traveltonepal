"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { TREKS_PATH } from "@/features/treks/constants";

import { DEPARTURES_PATH } from "../constants";
import { deleteDeparture } from "../services/departuresRepository";
import type { DepartureActionResult } from "./results";
import { FAILURE_MESSAGES } from "./results";

/** Deletes one date for good. departureId comes from the browser, so it is checked; access is enforced by RLS. */
export const removeDeparture = async (departureId: string): Promise<DepartureActionResult> => {
  await requireAdmin();
  if (!z.uuid().safeParse(departureId).success) return { ok: false, message: FAILURE_MESSAGES.not_found };

  try {
    if (!(await deleteDeparture(departureId))) return { ok: false, message: FAILURE_MESSAGES.not_found };
  } catch (error) {
    console.error(error);
    return { ok: false, message: FAILURE_MESSAGES.failed };
  }

  revalidatePath(DEPARTURES_PATH);
  // Trek editors show the same dates.
  revalidatePath(TREKS_PATH, "layout");
  return { ok: true, message: "Date deleted." };
};

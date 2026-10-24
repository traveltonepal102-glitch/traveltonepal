"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { TREKS_PATH } from "@/features/treks/constants";

import { DEPARTURES_PATH } from "../constants";
import { newDeparturesSchema } from "../schemas/departureSchema";
import { addDepartures as addDeparturesToDatabase } from "../services/departuresRepository";
import type { NewDepartures } from "../types";
import type { DepartureActionResult } from "./results";
import { FAILURE_MESSAGES } from "./results";

const plural = (count: number) => `${count} date${count === 1 ? "" : "s"}`;

/** Several dates for one trek (repeat, copy a season, copy to next year). Days the trek already has are skipped. */
export const addDepartures = async (input: NewDepartures): Promise<DepartureActionResult> => {
  await requireAdmin();
  const parsed = newDeparturesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the dates." };

  const result = await addDeparturesToDatabase(parsed.data);
  if (!result.ok) return { ok: false, message: FAILURE_MESSAGES[result.reason] };

  revalidatePath(DEPARTURES_PATH);
  // Trek editors show the same dates.
  revalidatePath(TREKS_PATH, "layout");
  const skipped = parsed.data.entries.length - result.added;
  if (!result.added) return { ok: false, message: "Nothing added: the trek already has a date on each of those days." };
  return { ok: true, message: `Added ${plural(result.added)}.${skipped ? ` ${plural(skipped)} skipped (already on the trek).` : ""}` };
};

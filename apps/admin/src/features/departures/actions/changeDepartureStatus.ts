"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { DEPARTURE_STATUS_VALUES, TREKS_PATH } from "@/features/treks/constants";

import { DEPARTURES_PATH } from "../constants";
import { setDepartureStatus } from "../services/departuresRepository";
import type { DepartureActionResult } from "./results";
import { FAILURE_MESSAGES } from "./results";

const inputSchema = z.object({ departureId: z.uuid(), status: z.enum(DEPARTURE_STATUS_VALUES) });

/** The one-click status buttons on each row. Both values come from the browser, so both are checked. */
export const changeDepartureStatus = async (departureId: string, status: string): Promise<DepartureActionResult> => {
  await requireAdmin();
  const parsed = inputSchema.safeParse({ departureId, status });
  if (!parsed.success) return { ok: false, message: FAILURE_MESSAGES.not_found };

  try {
    if (!(await setDepartureStatus(parsed.data.departureId, parsed.data.status))) return { ok: false, message: FAILURE_MESSAGES.not_found };
  } catch (error) {
    console.error(error);
    return { ok: false, message: FAILURE_MESSAGES.failed };
  }

  revalidatePath(DEPARTURES_PATH);
  // Trek editors show the same dates.
  revalidatePath(TREKS_PATH, "layout");
  return { ok: true, message: "Status changed." };
};

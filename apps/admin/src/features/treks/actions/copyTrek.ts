"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { readText } from "@/lib/forms/formFields";

import { TREKS_PATH, trekPath } from "../constants";
import { copyTrek as copyTrekInDatabase } from "../services/treksRepository";

export type CopyTrekState = { error: string | null };

const FAILURE_MESSAGES = {
  not_found: "That trek is no longer on Travel To Nepal. Reload the page and pick another.",
  forbidden: "Your account can't make this change.",
  failed: "The trek couldn't be copied. Try again in a moment.",
} as const;

/**
 * "Copy a trek from Travel To Nepal": a new draft trek on the website `siteId` (bound by the page), with the fields'
 * values and new ids, unrelated to the original afterwards. Opens it to be rewritten.
 */
export const copyTrek = async (siteId: string, _previous: CopyTrekState, formData: FormData): Promise<CopyTrekState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite?.status === "error") return { error: wrongSite.message };

  const trekId = readText(formData, "trekId");
  if (!z.uuid().safeParse(trekId).success) return { error: FAILURE_MESSAGES.not_found };

  const result = await copyTrekInDatabase(trekId, siteId);
  if (!result.ok) return { error: FAILURE_MESSAGES[result.reason] };

  revalidatePath(TREKS_PATH);
  redirect(`${trekPath(result.trekId)}?copied=1`);
};

import "server-only";

import { createWebsiteClient } from "@/lib/supabase/server";

import type { GuideFeedback, GuideFeedbackResult } from "./schema";

export const NOT_SAVED: GuideFeedbackResult = { status: "error", message: "We could not save that. Please try again." };

/**
 * Stores one vote (record_guide_feedback): the database checks the guide is live and refuses floods, and keeps
 * nothing about the visitor. The admin shows the totals on each travel guide.
 */
export const recordGuideFeedback = async ({ slug, vote }: GuideFeedback): Promise<GuideFeedbackResult> => {
  const { data: isRecorded, error } = await createWebsiteClient().rpc("record_guide_feedback", { p_slug: slug, p_is_helpful: vote === "yes" });
  if (error) {
    console.error(`Guide feedback for "${slug}" was not stored: ${error.code} ${error.message}`);
    return NOT_SAVED;
  }
  return isRecorded ? { status: "recorded" } : NOT_SAVED;
};

import "server-only";
import type { GuideFeedback, GuideFeedbackResult } from "@ttn/site-data/guideFeedback";

import { createDatabaseClient } from "@/lib/database";

export const NOT_SAVED: GuideFeedbackResult = { status: "error", message: "We could not save that. Please try again." };

/** Stores one vote: the database checks the blog is live on this website and refuses floods, and keeps nothing about the visitor. */
export const recordBlogFeedback = async ({ slug, vote }: GuideFeedback): Promise<GuideFeedbackResult> => {
  const { data: isRecorded, error } = await createDatabaseClient().rpc("record_guide_feedback", { p_slug: slug, p_is_helpful: vote === "yes" });
  if (error) {
    console.error(`Blog feedback for "${slug}" was not stored: ${error.code} ${error.message}`);
    return NOT_SAVED;
  }
  return isRecorded ? { status: "recorded" } : NOT_SAVED;
};

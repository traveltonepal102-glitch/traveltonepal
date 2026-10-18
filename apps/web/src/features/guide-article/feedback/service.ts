import "server-only";

import type { GuideFeedback, GuideFeedbackResult } from "./schema";

/**
 * True once votes are stored somewhere. Until then "Was this guide helpful?" only shows in `pnpm dev`
 * (votes are logged, not kept), so production never asks visitors for feedback that goes nowhere.
 */
export const IS_GUIDE_FEEDBACK_CONNECTED = false;

/** Whether the article shows the question. */
export const IS_GUIDE_FEEDBACK_OPEN = IS_GUIDE_FEEDBACK_CONNECTED || process.env.NODE_ENV === "development";

/**
 * Stores one vote. TODO(owner): choose where votes go (e.g. a Payload "guide-feedback" collection
 * with slug, vote and date, or an analytics event), then set IS_GUIDE_FEEDBACK_CONNECTED.
 */
export const recordGuideFeedback = async ({ slug, vote }: GuideFeedback): Promise<GuideFeedbackResult> => {
  if (process.env.NODE_ENV === "development") {
    console.info(`Guide feedback (dev only, not stored): "${slug}" voted ${vote}.`);
    return { status: "recorded" };
  }
  console.error(`Guide feedback for "${slug}" was not stored: no feedback store is connected.`);
  return { status: "error", message: "Feedback is not open yet." };
};

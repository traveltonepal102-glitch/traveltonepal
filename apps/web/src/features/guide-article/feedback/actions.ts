"use server";

import { guideFeedbackSchema } from "./schema";
import type { GuideFeedbackResult } from "./schema";
import { recordGuideFeedback } from "./service";

/** Server action behind "Was this guide helpful?". Checks the guide and the vote here: the browser is not trusted. */
export const sendGuideFeedback = async (input: unknown): Promise<GuideFeedbackResult> => {
  const parsed = guideFeedbackSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "We could not save that. Please try again." };
  return recordGuideFeedback(parsed.data);
};

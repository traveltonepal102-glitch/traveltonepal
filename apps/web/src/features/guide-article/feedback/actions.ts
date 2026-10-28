"use server";

import { guideFeedbackSchema } from "./schema";
import type { GuideFeedbackResult } from "./schema";
import { NOT_SAVED, recordGuideFeedback } from "./service";

/**
 * Server action behind "Was this guide helpful?". Checks the vote's shape here; the database checks that the guide
 * is live (the browser is not trusted).
 */
export const sendGuideFeedback = async (input: unknown): Promise<GuideFeedbackResult> => {
  const parsed = guideFeedbackSchema.safeParse(input);
  if (!parsed.success) return NOT_SAVED;
  return recordGuideFeedback(parsed.data);
};

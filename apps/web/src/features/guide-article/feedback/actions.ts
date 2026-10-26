"use server";

import { listGuidePageSlugs } from "../services/guidePageRepository";
import { guideFeedbackSchema } from "./schema";
import type { GuideFeedbackResult } from "./schema";
import { recordGuideFeedback } from "./service";

const NOT_SAVED: GuideFeedbackResult = { status: "error", message: "We could not save that. Please try again." };

/**
 * Server action behind "Was this guide helpful?". Checks the vote and that the guide is published here: the browser
 * is not trusted.
 */
export const sendGuideFeedback = async (input: unknown): Promise<GuideFeedbackResult> => {
  const parsed = guideFeedbackSchema.safeParse(input);
  if (!parsed.success) return NOT_SAVED;
  if (!(await listGuidePageSlugs()).includes(parsed.data.slug)) return NOT_SAVED;
  return recordGuideFeedback(parsed.data);
};

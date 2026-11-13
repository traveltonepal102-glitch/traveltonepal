"use server";

import { guideFeedbackSchema } from "@ttn/site-data/guideFeedback";
import type { GuideFeedbackResult } from "@ttn/site-data/guideFeedback";

import { NOT_SAVED, recordBlogFeedback } from "./service";

/** Behind "Was this helpful?": checks the vote's shape here; the database checks that the blog is live (the browser is not trusted). */
export const sendBlogFeedback = async (input: unknown): Promise<GuideFeedbackResult> => {
  const parsed = guideFeedbackSchema.safeParse(input);
  if (!parsed.success) return NOT_SAVED;
  return recordBlogFeedback(parsed.data);
};

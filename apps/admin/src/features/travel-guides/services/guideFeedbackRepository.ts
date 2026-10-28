import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { feedbackByGuide } from "../lib/guideFeedback";
import type { GuideFeedbackTotals } from "../lib/guideFeedback";

/** Every guide's "Was this guide helpful?" totals, by guide id (counted in the database). */
export const listFeedbackTotals = async (): Promise<Map<string, GuideFeedbackTotals>> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("guide_feedback_totals");
  if (error) throw new Error(`Could not load guide feedback: ${error.message}`);
  return feedbackByGuide(data);
};

/** One guide's totals; null without votes. */
export const getFeedbackTotals = async (articleId: string): Promise<GuideFeedbackTotals | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("guide_feedback_totals", { p_article_id: articleId });
  if (error) throw new Error(`Could not load the feedback on travel guide ${articleId}: ${error.message}`);
  return feedbackByGuide(data).get(articleId) ?? null;
};

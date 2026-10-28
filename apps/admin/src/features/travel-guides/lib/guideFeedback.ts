/** A guide's "Was this guide helpful?" answers from the website. */
export type GuideFeedbackTotals = {
  helpful: number;
  notHelpful: number;
  /** ISO time of the newest vote. */
  lastVoteAt: string;
};

/** A row of guide_feedback_totals. */
type GuideFeedbackTotalsRow = { article_id: string; helpful_count: number; not_helpful_count: number; last_vote_at: string };

export const toFeedbackTotals = (row: GuideFeedbackTotalsRow): GuideFeedbackTotals => ({
  helpful: row.helpful_count,
  notHelpful: row.not_helpful_count,
  lastVoteAt: row.last_vote_at,
});

/** The totals by guide id; a guide without votes is not in it. */
export const feedbackByGuide = (rows: readonly GuideFeedbackTotalsRow[]) => new Map(rows.map((row) => [row.article_id, toFeedbackTotals(row)]));

/** Share of "Yes", 0–100 rounded; null without votes. */
export const helpfulPercent = ({ helpful, notHelpful }: Pick<GuideFeedbackTotals, "helpful" | "notHelpful">) => {
  const votes = helpful + notHelpful;
  return votes === 0 ? null : Math.round((helpful / votes) * 100);
};

/** "86% helpful · 14 votes", or "No votes yet". */
export const feedbackSummary = (totals: GuideFeedbackTotals | null) => {
  const percent = totals && helpfulPercent(totals);
  if (!totals || percent === null) return "No votes yet";
  const votes = totals.helpful + totals.notHelpful;
  return `${percent}% helpful · ${votes} ${votes === 1 ? "vote" : "votes"}`;
};

import { describe, expect, it } from "vitest";

import { feedbackByGuide, feedbackSummary, helpfulPercent } from "./guideFeedback";

const LAST_VOTE = "2026-10-28T10:00:00Z";

describe("helpfulPercent", () => {
  it("is the rounded share of Yes", () => {
    expect(helpfulPercent({ helpful: 2, notHelpful: 1 })).toBe(67);
    expect(helpfulPercent({ helpful: 0, notHelpful: 4 })).toBe(0);
    expect(helpfulPercent({ helpful: 5, notHelpful: 0 })).toBe(100);
  });

  it("is null without votes", () => {
    expect(helpfulPercent({ helpful: 0, notHelpful: 0 })).toBeNull();
  });
});

describe("feedbackSummary", () => {
  it("says the share and the number of votes", () => {
    expect(feedbackSummary({ helpful: 12, notHelpful: 2, lastVoteAt: LAST_VOTE })).toBe("86% helpful · 14 votes");
    expect(feedbackSummary({ helpful: 1, notHelpful: 0, lastVoteAt: LAST_VOTE })).toBe("100% helpful · 1 vote");
  });

  it("says so when nobody voted", () => {
    expect(feedbackSummary(null)).toBe("No votes yet");
  });
});

describe("feedbackByGuide", () => {
  it("maps each guide's row to its totals", () => {
    const totals = feedbackByGuide([{ article_id: "a", helpful_count: 3, not_helpful_count: 1, last_vote_at: LAST_VOTE }]);
    expect(totals.get("a")).toEqual({ helpful: 3, notHelpful: 1, lastVoteAt: LAST_VOTE });
    expect(totals.get("b")).toBeUndefined();
  });
});

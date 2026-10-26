import { describe, expect, it } from "vitest";

import { guideFeedbackSchema } from "./schema";

describe("guideFeedbackSchema", () => {
  it("accepts a yes or no for a guide's address", () => {
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "yes" }).success).toBe(true);
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "no" }).success).toBe(true);
  });

  it("rejects what can't be a guide's address, and other votes (whether the guide is published is checked by the action)", () => {
    expect(guideFeedbackSchema.safeParse({ slug: "../admin", vote: "yes" }).success).toBe(false);
    expect(guideFeedbackSchema.safeParse({ slug: "Best Time", vote: "yes" }).success).toBe(false);
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "maybe" }).success).toBe(false);
    expect(guideFeedbackSchema.safeParse({ vote: "yes" }).success).toBe(false);
  });
});

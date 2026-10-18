import { describe, expect, it } from "vitest";

import { guideFeedbackSchema } from "./schema";

describe("guideFeedbackSchema", () => {
  it("accepts a yes or no for a guide with a page", () => {
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "yes" }).success).toBe(true);
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "no" }).success).toBe(true);
  });

  it("rejects unknown guides and other votes", () => {
    expect(guideFeedbackSchema.safeParse({ slug: "nepal-visa-for-trekkers", vote: "yes" }).success).toBe(false);
    expect(guideFeedbackSchema.safeParse({ slug: "best-time-to-trek-langtang", vote: "maybe" }).success).toBe(false);
    expect(guideFeedbackSchema.safeParse({ vote: "yes" }).success).toBe(false);
  });
});

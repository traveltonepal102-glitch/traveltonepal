import { describe, expect, it } from "vitest";

import { newsletterSchema } from "./schema";

describe("newsletterSchema", () => {
  it("trims and lower-cases the address and keeps an empty name", () => {
    expect(newsletterSchema.parse({ email: "  Anna@Example.COM " })).toEqual({ name: "", email: "anna@example.com" });
  });

  it("refuses an address that isn't one", () => {
    expect(newsletterSchema.safeParse({ email: "anna@" }).success).toBe(false);
  });

  it("refuses a very long name", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.co", name: "x".repeat(81) }).success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { newsletterSchema } from "./schema";

describe("newsletterSchema", () => {
  it("trims and lower-cases a valid address", () => {
    expect(newsletterSchema.parse({ email: "  Anna.Weber@Example.COM " }).email).toBe("anna.weber@example.com");
  });

  it("rejects an invalid address with a readable message", () => {
    const result = newsletterSchema.safeParse({ email: "anna@" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Please enter a valid email address.");
  });
});

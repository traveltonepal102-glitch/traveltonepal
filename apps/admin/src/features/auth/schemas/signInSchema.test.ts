import { describe, expect, it } from "vitest";

import { signInFormValues, signInSchema } from "./signInSchema";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.set(key, value));
  return signInFormValues(data);
};

describe("signInSchema", () => {
  it("accepts an email and password, tidying the email", () => {
    const result = signInSchema.safeParse(form({ email: "  Owner@Example.COM ", password: "secret", remember: "on", next: "/" }));
    expect(result.success && result.data).toEqual({ email: "owner@example.com", password: "secret", remember: "on", next: "/" });
  });

  it("treats a missing checkbox as not remembered", () => {
    const result = signInSchema.safeParse(form({ email: "a@b.co", password: "x" }));
    expect(result.success && result.data.remember).toBeUndefined();
  });

  it("rejects a bad email, an empty or too long password", () => {
    expect(signInSchema.safeParse(form({ email: "not-an-email", password: "x" })).success).toBe(false);
    expect(signInSchema.safeParse(form({ email: "a@b.co", password: "" })).success).toBe(false);
    expect(signInSchema.safeParse(form({ email: "a@b.co", password: "x".repeat(73) })).success).toBe(false);
  });
});

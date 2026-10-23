import { describe, expect, it } from "vitest";

import { readRememberedEmail, rememberedEmailCookie } from "./rememberedEmail";

describe("rememberedEmailCookie", () => {
  it("is HTTP-only, site-wide (sign-out renders the sign-in page) and kept 30 days", () => {
    expect(rememberedEmailCookie("owner@example.com", true)).toEqual({
      name: "ttn_admin_email",
      value: "owner@example.com",
      options: { path: "/", sameSite: "lax", httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 },
    });
    expect(rememberedEmailCookie("owner@example.com", false).options.secure).toBe(false);
  });
});

describe("readRememberedEmail", () => {
  it("returns a valid email, tidied", () => {
    expect(readRememberedEmail(" Owner@Example.com ")).toBe("owner@example.com");
  });

  it("ignores a missing, broken or tampered value", () => {
    for (const value of [undefined, "", "not-an-email", "<script>@x", `${"a".repeat(250)}@b.co`]) {
      expect(readRememberedEmail(value)).toBe("");
    }
  });
});

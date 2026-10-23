import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "./redirectTarget";

describe("getSafeRedirectPath", () => {
  it("keeps paths on this site", () => {
    expect(getSafeRedirectPath("/")).toBe("/");
    expect(getSafeRedirectPath("/treks?page=2")).toBe("/treks?page=2");
  });

  it("sends other sites and odd values home", () => {
    for (const value of ["//evil.com", "https://evil.com", "/\\evil.com", "evil.com", "", undefined, ["/x"], 42]) {
      expect(getSafeRedirectPath(value)).toBe("/");
    }
  });

  it("never goes back to the sign-in page", () => {
    expect(getSafeRedirectPath("/login")).toBe("/");
    expect(getSafeRedirectPath("/login?next=/x")).toBe("/");
  });
});

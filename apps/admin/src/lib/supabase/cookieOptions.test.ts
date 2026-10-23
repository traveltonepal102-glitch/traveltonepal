import { describe, expect, it } from "vitest";

import { REMEMBER_SECONDS, authCookieOptions, readRememberChoice, rememberCookie } from "./cookieOptions";

const SUPABASE_DEFAULTS = { path: "/", sameSite: "lax" as const, httpOnly: false, maxAge: 400 * 24 * 60 * 60 };

describe("authCookieOptions", () => {
  it("makes session cookies HTTP-only, and secure in production", () => {
    expect(authCookieOptions(SUPABASE_DEFAULTS, true, true)).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    expect(authCookieOptions(SUPABASE_DEFAULTS, true, false).secure).toBe(false);
  });

  it("keeps them 7 days when remembered, until the browser closes when not", () => {
    expect(authCookieOptions(SUPABASE_DEFAULTS, true, true).maxAge).toBe(REMEMBER_SECONDS);
    const sessionOnly = authCookieOptions({ ...SUPABASE_DEFAULTS, expires: new Date() }, false, true);
    expect(sessionOnly).not.toHaveProperty("maxAge");
    expect(sessionOnly).not.toHaveProperty("expires");
  });

  it("leaves deletions as deletions", () => {
    expect(authCookieOptions({ ...SUPABASE_DEFAULTS, maxAge: 0 }, true, true).maxAge).toBe(0);
    expect(authCookieOptions({ ...SUPABASE_DEFAULTS, maxAge: 0 }, false, true).maxAge).toBe(0);
  });
});

describe("remember choice", () => {
  it("reads only an explicit yes", () => {
    expect(readRememberChoice("1")).toBe(true);
    expect(readRememberChoice("0")).toBe(false);
    expect(readRememberChoice(undefined)).toBe(false);
  });

  it("stores the choice with the same lifetime as the session", () => {
    expect(rememberCookie(true, true)).toMatchObject({ value: "1", options: { maxAge: REMEMBER_SECONDS, httpOnly: true } });
    expect(rememberCookie(false, true).options).not.toHaveProperty("maxAge");
  });
});

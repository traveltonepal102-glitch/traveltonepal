import type { CookieOptions } from "@supabase/ssr";

import { REMEMBER_COOKIE, REMEMBER_DAYS } from "@/features/auth/constants";

export const REMEMBER_SECONDS = REMEMBER_DAYS * 24 * 60 * 60;

/**
 * Options for the Supabase session cookies. Only our server reads them, so they are HTTP-only (scripts in the
 * page can't steal them) and secure in production. They last REMEMBER_DAYS with "Keep me signed in", else
 * until the browser closes. A deletion (maxAge 0) is kept as it is.
 */
export const authCookieOptions = (options: CookieOptions, isRemembered: boolean, isProduction: boolean): CookieOptions => {
  const base: CookieOptions = { ...options, path: "/", sameSite: "lax", httpOnly: true, secure: isProduction };
  if (options.maxAge === 0) return base;

  // Without maxAge and expires the browser drops the cookie when it closes.
  const sessionOnly = { ...base };
  delete sessionOnly.maxAge;
  delete sessionOnly.expires;
  return isRemembered ? { ...sessionOnly, maxAge: REMEMBER_SECONDS } : sessionOnly;
};

/** The "Keep me signed in" choice, read from its cookie. */
export const readRememberChoice = (value: string | undefined) => value === "1";

/** Cookie that stores the "Keep me signed in" choice, with the same lifetime as the session cookies. */
export const rememberCookie = (isRemembered: boolean, isProduction: boolean) => ({
  name: REMEMBER_COOKIE,
  value: isRemembered ? "1" : "0",
  options: authCookieOptions({}, isRemembered, isProduction),
});

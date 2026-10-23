import { z } from "zod";

import { REMEMBERED_EMAIL_COOKIE, REMEMBERED_EMAIL_DAYS } from "../constants";

const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

/**
 * Site-wide path: signing out runs on the page you sign out from, and Next.js renders the sign-in page in
 * that same response, so a cookie limited to /login would not be there to fill the form in.
 */
const COOKIE_PATH = "/";

/** The cookie that keeps the email for the sign-in page. HTTP-only (page scripts can't read it), secure in production. */
export const rememberedEmailCookie = (email: string, isProduction: boolean) => ({
  name: REMEMBERED_EMAIL_COOKIE,
  value: email,
  options: {
    path: COOKIE_PATH,
    sameSite: "lax" as const,
    httpOnly: true,
    secure: isProduction,
    maxAge: REMEMBERED_EMAIL_DAYS * 24 * 60 * 60,
  },
});

/** Where the cookie lives, to delete it (a cookie is only deleted with the same path it was set with). */
export const REMEMBERED_EMAIL_COOKIE_TARGET = { name: REMEMBERED_EMAIL_COOKIE, path: COOKIE_PATH };

/** The stored email, or "" when there is none or it isn't a valid email (the cookie is not trusted). */
export const readRememberedEmail = (value: string | undefined): string => {
  const result = emailSchema.safeParse(value ?? "");
  return result.success ? result.data : "";
};

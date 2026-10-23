import type { AdminRole } from "@/lib/supabase/database.types";

export const ROLE_LABELS: Record<AdminRole, string> = { super_admin: "Super admin", editor: "Editor" };

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/";

/** Locked 15 minutes after 5 wrong passwords for one email (enforced in Postgres: login_record_failure). */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME_SECONDS = 15 * 60;

/**
 * "Keep me signed in": the session cookies last this long. Unticked, they end when the browser closes.
 * Postgres also refuses any session older than 7 days (current_admin), whatever the cookies say.
 */
export const REMEMBER_DAYS = 7;

/** Remembers the visitor's "Keep me signed in" choice, so refreshed session cookies keep the same lifetime. */
export const REMEMBER_COOKIE = "ttn_admin_remember";

/**
 * With "Keep me signed in", the email is kept too, so the sign-in page fills it in after signing out.
 * Kept longer than the session; cleared by signing in unticked or by "Not you?".
 */
export const REMEMBERED_EMAIL_COOKIE = "ttn_admin_email";
export const REMEMBERED_EMAIL_DAYS = 30;

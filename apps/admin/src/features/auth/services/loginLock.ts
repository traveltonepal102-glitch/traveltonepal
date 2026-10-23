import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { LOCK_TIME_SECONDS, MAX_LOGIN_ATTEMPTS } from "../constants";

/**
 * The sign-in lock, kept per email in Postgres (login_locks) so it holds across servers and restarts.
 * Errors are thrown: the sign-in action then refuses to sign in rather than skip the lock.
 */

/** When the email is locked, the time it unlocks; else null. */
export const getLockedUntil = async (email: string): Promise<Date | null> => {
  const { data, error } = await createSupabaseAdminClient().rpc("login_locked_until", { p_email: email });
  if (error) throw new Error(`Could not read the sign-in lock: ${error.message}`);
  return data ? new Date(data) : null;
};

/** Counts a wrong password and locks the email at MAX_LOGIN_ATTEMPTS. */
export const recordFailedSignIn = async (email: string) => {
  const { data, error } = await createSupabaseAdminClient().rpc("login_record_failure", {
    p_email: email,
    p_max_attempts: MAX_LOGIN_ATTEMPTS,
    p_lock_seconds: LOCK_TIME_SECONDS,
  });
  const row = data?.[0];
  if (error || !row) throw new Error(`Could not record the failed sign-in: ${error?.message ?? "no result"}`);
  return { failedAttempts: row.failed_attempts, lockedUntil: row.locked_until ? new Date(row.locked_until) : null };
};

/** After a correct password: the count starts again. */
export const clearFailedSignIns = async (email: string) => {
  const { error } = await createSupabaseAdminClient().rpc("login_clear_failures", { p_email: email });
  if (error) throw new Error(`Could not clear the failed sign-ins: ${error.message}`);
};

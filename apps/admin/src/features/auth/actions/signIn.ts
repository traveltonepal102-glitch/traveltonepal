"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rememberCookie } from "@/lib/supabase/cookieOptions";

import { getSafeRedirectPath } from "../lib/redirectTarget";
import { REMEMBERED_EMAIL_COOKIE_TARGET, rememberedEmailCookie } from "../lib/rememberedEmail";
import { INVALID_INPUT, UNAVAILABLE, lockedOut, wrongCredentials } from "../lib/signInMessages";
import type { SignInError } from "../lib/signInMessages";
import { signInFormValues, signInSchema } from "../schemas/signInSchema";
import { clearFailedSignIns, getLockedUntil, recordFailedSignIn } from "../services/loginLock";

export type SignInState = {
  error: SignInError | null;
  /** Shown again in the form after an error, so the visitor doesn't retype it. */
  email: string;
  remember: boolean;
};

const isProduction = process.env.NODE_ENV === "production";

type Attempt = { status: "signed-in" } | { status: "error"; error: SignInError };

/** Checks the lock, then the password, then that the user is an admin. Never throws to the visitor. */
const attemptSignIn = async (email: string, password: string, remember: boolean): Promise<Attempt> => {
  const lockedUntil = await getLockedUntil(email);
  if (lockedUntil) return { status: "error", error: lockedOut(lockedUntil, new Date()) };

  const supabase = await createSupabaseServerClient({ remember });
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

  // Signed in, but only admins may stay: anyone else is signed out and gets the same message as a wrong password.
  const isAdmin = !authError && Boolean((await supabase.rpc("current_admin")).data?.length);

  if (authError && authError.code !== "invalid_credentials") {
    console.error(`Sign-in failed: ${authError.code ?? authError.message}`);
    return { status: "error", error: UNAVAILABLE };
  }

  if (!isAdmin) {
    if (!authError) await supabase.auth.signOut({ scope: "local" });
    const failure = await recordFailedSignIn(email);
    return {
      status: "error",
      error: failure.lockedUntil ? lockedOut(failure.lockedUntil, new Date()) : wrongCredentials(failure.failedAttempts),
    };
  }

  await clearFailedSignIns(email);
  return { status: "signed-in" };
};

/** Server Action behind the sign-in form. Everything is checked here: the browser is not trusted. */
export const signIn = async (_previous: SignInState, formData: FormData): Promise<SignInState> => {
  const parsed = signInSchema.safeParse(signInFormValues(formData));
  const email = String(formData.get("email") ?? "").trim();
  const remember = formData.get("remember") === "on";
  if (!parsed.success) return { error: INVALID_INPUT, email, remember };

  let attempt: Attempt;
  try {
    attempt = await attemptSignIn(parsed.data.email, parsed.data.password, remember);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Sign-in failed");
    attempt = { status: "error", error: UNAVAILABLE };
  }
  if (attempt.status === "error") return { error: attempt.error, email, remember };

  const cookieStore = await cookies();
  const choice = rememberCookie(remember, isProduction);
  cookieStore.set(choice.name, choice.value, choice.options);

  // Ticked: keep the email for the sign-in page. Unticked: forget any email kept before.
  if (remember) {
    const kept = rememberedEmailCookie(parsed.data.email, isProduction);
    cookieStore.set(kept.name, kept.value, kept.options);
  } else {
    cookieStore.delete(REMEMBERED_EMAIL_COOKIE_TARGET);
  }

  // Outside the try: redirect() works by throwing.
  redirect(getSafeRedirectPath(parsed.data.next));
};

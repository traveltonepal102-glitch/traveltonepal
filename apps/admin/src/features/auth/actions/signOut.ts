"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { LOGIN_PATH, REMEMBER_COOKIE } from "../constants";

/** Ends this browser's session (the server revokes it too) and goes to the sign-in page. */
export const signOut = async () => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.error(`Sign-out failed: ${error.message}`);

  (await cookies()).delete(REMEMBER_COOKIE);
  redirect(LOGIN_PATH);
};

import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";

import type { CurrentAdmin } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { LOGIN_PATH } from "../constants";

/**
 * The signed-in admin, or null. Postgres decides (current_admin): a valid session for a user in
 * admin_users, not banned, not signed out or revoked, and no older than 7 days. Asked once per request.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const supabase = await createSupabaseServerClient();

  // No valid session token: signed out, nothing to ask Postgres.
  const { data: session } = await supabase.auth.getClaims();
  if (!session?.claims) return null;

  const { data, error } = await supabase.rpc("current_admin");
  if (error) {
    // Logged for us; the visitor is treated as signed out (fails closed).
    console.error(`current_admin failed: ${error.message}`);
    return null;
  }
  return data?.[0] ?? null;
});

/**
 * Call at the top of every protected page, layout and Server Action. The proxy only checks that a
 * session exists; this checks that it belongs to an admin.
 */
export const requireAdmin = async (): Promise<CurrentAdmin> => {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
};

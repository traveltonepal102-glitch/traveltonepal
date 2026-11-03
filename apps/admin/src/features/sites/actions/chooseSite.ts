"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { CURRENT_SITE_COOKIE, CURRENT_SITE_COOKIE_MAX_AGE } from "../constants";
import { listSites } from "../services/sitesRepository";

const isProduction = process.env.NODE_ENV === "production";

/**
 * "Working on": remembers the site the admin picked (an HTTP-only cookie) and renders the screens again. The id
 * comes from the browser, so only a site the database has is kept.
 */
export const chooseSite = async (siteId: string): Promise<void> => {
  await requireAdmin();
  const sites = await listSites();
  if (!sites.some((site) => site.id === siteId)) return;

  (await cookies()).set(CURRENT_SITE_COOKIE, siteId, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: isProduction,
    maxAge: CURRENT_SITE_COOKIE_MAX_AGE,
  });
  revalidatePath("/", "layout");
};

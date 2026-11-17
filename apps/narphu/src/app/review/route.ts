import type { NextRequest } from "next/server";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

/** /review: Google's review box from this website's Settings (only ever that link); without one, its Google profile, then the home page. */
export const GET = async (request: NextRequest) => {
  const { googleWriteUrl, googleProfileUrl } = await getSiteSettings();
  const target = googleWriteUrl || googleProfileUrl;
  if (!target) return Response.redirect(new URL(ROUTES.home, request.url), 307);
  return new Response(null, { status: 307, headers: { Location: target, "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
};

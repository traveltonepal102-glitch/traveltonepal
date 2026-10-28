import type { NextRequest } from "next/server";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

/**
 * /review: the short link sent to trekkers after their trek and behind every "Write a review on Google" button. It
 * sends the visitor to Google's review box from Site settings (only ever that link, so it can't redirect elsewhere);
 * without one, to the Google profile, and without that, the home page.
 */
export const GET = async (request: NextRequest) => {
  const { googleReviews } = await getSiteSettings();
  const target = googleReviews.writeUrl || googleReviews.profileUrl;
  if (!target) return Response.redirect(new URL(ROUTES.home, request.url), 307);
  return new Response(null, { status: 307, headers: { Location: target, "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
};

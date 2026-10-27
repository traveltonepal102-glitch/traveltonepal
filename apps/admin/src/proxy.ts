import { errorMonitoringOrigin } from "@ttn/config/errorMonitoring";
import type { NextRequest } from "next/server";

import { buildContentSecurityPolicy, createNonce } from "@/lib/security/contentSecurityPolicy";
import { PHOTO_ORIGINS } from "@/lib/storage/photoOrigins";
import { updateSession } from "@/lib/supabase/proxy";

const isDevelopment = process.env.NODE_ENV === "development";

/** YouTube's video pictures, shown in the trek editor's video list (only pictures: the videos never play here). */
const YOUTUBE_PICTURES = "https://i.ytimg.com";
/** Where the browser sends error reports (Sentry), when error monitoring is on. */
const ERROR_REPORTS = errorMonitoringOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN);
const ORIGINS = {
  images: [...PHOTO_ORIGINS.images, YOUTUBE_PICTURES],
  connections: [...PHOTO_ORIGINS.uploads, ...(ERROR_REPORTS ? [ERROR_REPORTS] : [])],
};

/**
 * Before every admin request: a fresh Content-Security-Policy nonce, the Supabase session refresh, and a
 * redirect to /login when signed out. Pages and Server Actions still call requireAdmin() themselves.
 */
export const proxy = async (request: NextRequest) => {
  const nonce = createNonce();
  const policy = buildContentSecurityPolicy(nonce, isDevelopment, ORIGINS);

  // Next.js reads the nonce from the request's CSP header and puts it on its own scripts.
  const response = await updateSession(request, { "x-nonce": nonce, "content-security-policy": policy });
  response.headers.set("Content-Security-Policy", policy);
  return response;
};

export const config = {
  // Everything except Next.js assets and the public folder's images and icons.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

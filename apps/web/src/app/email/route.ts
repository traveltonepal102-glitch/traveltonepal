import { mailtoUrl } from "@ttn/config/contact";
import type { NextRequest } from "next/server";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

const MAX_LENGTH = { subject: 200, body: 2000 } as const;

/**
 * /email?subject=…&body=…: every email link points here, and this opens an email to today's address from Site
 * settings (only ever that address). Without an address yet, the Contact page.
 */
export const GET = async (request: NextRequest) => {
  const { contact } = await getSiteSettings();
  if (!contact.email) return Response.redirect(new URL(ROUTES.contact, request.url), 307);
  const params = request.nextUrl.searchParams;
  const draft = {
    subject: params.get("subject")?.slice(0, MAX_LENGTH.subject) || undefined,
    body: params.get("body")?.slice(0, MAX_LENGTH.body) || undefined,
  };
  return new Response(null, {
    status: 307,
    headers: { Location: mailtoUrl(contact.email, draft), "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  });
};

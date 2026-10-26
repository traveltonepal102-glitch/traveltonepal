import { whatsAppChatUrl } from "@ttn/config/contact";
import type { NextRequest } from "next/server";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

/** WhatsApp allows long messages; anything longer than this isn't a message from our pages. */
const MAX_MESSAGE_LENGTH = 2000;

/**
 * /whatsapp?text=…: every WhatsApp button links here, and this sends the visitor on to a chat with today's number
 * from Site settings (only ever that number, so it can't be used to redirect elsewhere). Without a number yet, the
 * Contact page.
 */
export const GET = async (request: NextRequest) => {
  const { contact } = await getSiteSettings();
  if (!contact.phoneDigits) return Response.redirect(new URL(ROUTES.contact, request.url), 307);
  const text = request.nextUrl.searchParams.get("text")?.slice(0, MAX_MESSAGE_LENGTH) || undefined;
  return new Response(null, {
    status: 307,
    headers: { Location: whatsAppChatUrl(contact.phoneDigits, text), "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  });
};

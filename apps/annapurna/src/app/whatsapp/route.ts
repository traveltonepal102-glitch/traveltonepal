import { whatsAppChatUrl } from "@ttn/config/contact";
import type { NextRequest } from "next/server";

import { countContactClick } from "@/features/site-settings/services/contactClicks";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

const MAX_MESSAGE_LENGTH = 2000;

/** /whatsapp?text=…: every WhatsApp button links here, and this opens a chat with this website's number from Settings (only ever that number). Without one yet, the home page. */
export const GET = async (request: NextRequest) => {
  countContactClick(request, "whatsapp");
  const { phoneDigits } = await getSiteSettings();
  if (!phoneDigits) return Response.redirect(new URL(ROUTES.home, request.url), 307);
  const text = request.nextUrl.searchParams.get("text")?.slice(0, MAX_MESSAGE_LENGTH) || undefined;
  return new Response(null, { status: 307, headers: { Location: whatsAppChatUrl(phoneDigits, text), "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
};

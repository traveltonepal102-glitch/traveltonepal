import "server-only";
import { after } from "next/server";
import type { NextRequest } from "next/server";

import { createWebsiteClient } from "@/lib/supabase/server";

import { clickPagePath, isPrefetch } from "./clickSource";
import type { ContactChannel } from "./clickSource";

/**
 * Counts one click on a WhatsApp or email button for the page it came from (Privacy policy › "Button click counts"):
 * no cookie, no IP address. Runs after the redirect is sent, so the visitor never waits; a failed count is only logged.
 */
export const countContactClick = (request: NextRequest, channel: ContactChannel) => {
  if (isPrefetch(request.headers)) return;
  const pagePath = clickPagePath(request.headers.get("referer"), request.nextUrl.origin);
  after(async () => {
    const { error } = await createWebsiteClient().rpc("record_contact_click", { p_channel: channel, p_page_path: pagePath });
    if (error) console.error(`A ${channel} click was not counted: ${error.code} ${error.message}`);
  });
};

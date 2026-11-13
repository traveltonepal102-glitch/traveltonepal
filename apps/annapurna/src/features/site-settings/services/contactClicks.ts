import "server-only";
import { clickPagePath, isPrefetch } from "@ttn/site-data/clickSource";
import type { ContactChannel } from "@ttn/site-data/clickSource";
import { after } from "next/server";
import type { NextRequest } from "next/server";

import { createDatabaseClient } from "@/lib/database";

/** Counts one click for the page it came from (no cookie, no IP address), after the redirect is sent; a failed count is only logged. */
export const countContactClick = (request: NextRequest, channel: ContactChannel) => {
  if (isPrefetch(request.headers)) return;
  const pagePath = clickPagePath(request.headers.get("referer"), request.nextUrl.origin);
  after(async () => {
    const { error } = await createDatabaseClient().rpc("record_contact_click", { p_channel: channel, p_page_path: pagePath });
    if (error) console.error(`A ${channel} click was not counted: ${error.code} ${error.message}`);
  });
};

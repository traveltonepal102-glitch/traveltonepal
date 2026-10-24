import { revalidateTag } from "next/cache";

import { env } from "@/env";
import { isAuthorizedRefresh, readRefreshTags } from "@/lib/refreshRequest";

/**
 * The admin calls this after a save so the website shows the change at once: POST { tags: [...] } with
 * "Authorization: Bearer <REVALIDATE_SECRET>" (packages/config/src/websiteCache.ts). The tagged reads expire
 * now, so the next visitor gets fresh data instead of the cached copy.
 */
export const POST = async (request: Request) => {
  // Not set up (no secret): answer as if the route didn't exist.
  if (!env.REVALIDATE_SECRET) return Response.json({ error: "Not found" }, { status: 404 });
  if (!isAuthorizedRefresh(request.headers.get("authorization"), env.REVALIDATE_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = readRefreshTags(await request.json().catch(() => null));
  if (!tags) return Response.json({ error: "Send { tags: [...] } with known tags." }, { status: 400 });

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ refreshed: tags });
};

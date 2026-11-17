import { isAuthorizedRefresh, readRefreshTags } from "@ttn/site-data/refreshRequest";
import { revalidatePath, revalidateTag } from "next/cache";

import { env } from "@/env";

const CRAWLER_FILES = ["/robots.txt", "/sitemap.xml"];

/** The admin calls this after a save so the website shows the change at once: POST { tags: [...] } with "Authorization: Bearer <REVALIDATE_SECRET>". */
export const POST = async (request: Request) => {
  if (!env.REVALIDATE_SECRET) return Response.json({ error: "Not found" }, { status: 404 });
  if (!isAuthorizedRefresh(request.headers.get("authorization"), env.REVALIDATE_SECRET)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const tags = readRefreshTags(await request.json().catch(() => null));
  if (!tags) return Response.json({ error: "Send { tags: [...] } with known tags." }, { status: 400 });

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  // robots.txt and sitemap.xml are files built at deploy that the tags don't reach: without this, a website set "Live"
  // in Sites kept telling Google "Disallow: /", and a new trek or blog was missing from the sitemap, until the next deploy.
  for (const path of CRAWLER_FILES) revalidatePath(path);
  return Response.json({ refreshed: tags });
};

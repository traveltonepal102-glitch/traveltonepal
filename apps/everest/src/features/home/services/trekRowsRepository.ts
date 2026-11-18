import "server-only";

import { WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";

/** A read's rows, or an error (a failed refresh then keeps the last good page). */
export const check = <Row>({ data, error }: { data: Row | null; error: { message: string } | null }, what: string): Row => {
  if (error || data === null) throw new Error(`Could not load ${what}: ${error?.message ?? "nothing found"}`);
  return data;
};

/** A trek's own rows for its page; `page` is null when it has none. */
export const readTrekRows = async (slug: string) => {
  const client = createDatabaseClient();
  const [page, photos, guides] = await Promise.all([
    client.from("web_trek_pages").select("*").eq("slug", slug).eq("locale", WEBSITE_LOCALE).maybeSingle(),
    client.from("web_trek_photos").select("*").eq("trek_slug", slug),
    client.from("web_trek_guides").select("*").eq("trek_slug", slug).eq("locale", WEBSITE_LOCALE),
  ]);
  if (page.error) throw new Error(`Could not load the trek "${slug}": ${page.error.message}`);
  return { page: page.data, photos: check(photos, "the trek's photos"), guides: check(guides, "the trek's guides") };
};

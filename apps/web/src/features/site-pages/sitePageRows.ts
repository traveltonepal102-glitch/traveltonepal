import type { WebSitePageRow } from "@/lib/supabase/database.types";
import { coverImage } from "@/lib/images";

import type { SitePageTop } from "./types";

/** A page row's top and Google result; `subject` names what the page is about, for the photo's image text. */
export const toSitePageTop = (row: WebSitePageRow, photosBaseUrl: string, subject: string): SitePageTop => ({
  eyebrow: row.eyebrow.trim(),
  heading: row.heading.trim(),
  intro: row.intro.trim(),
  seo: { title: row.seo_title.trim(), description: row.seo_description.trim(), keyword: row.seo_keyword.trim() },
  cover: coverImage(row, photosBaseUrl, subject),
  updatedAt: row.updated_at,
});

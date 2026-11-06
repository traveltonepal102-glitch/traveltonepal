import type { WebSitePageRow } from "@ttn/site-data/database.types";
import { coverImage } from "@ttn/site-data/images";
import { toPageDates } from "@ttn/site-data/pageDates";
import { photoShareUrl } from "@ttn/ui/lib/photos";

import type { SitePageTop } from "./types";

/** A page row's top and Google result; `subject` names what the page is about, for the photo's image text. A blank Google title or description takes the page's own words. */
export const toSitePageTop = (row: WebSitePageRow, photosBaseUrl: string, subject: string): SitePageTop => {
  const heading = row.heading.trim();
  const intro = row.intro.trim();
  const shareId = row.share_id ?? row.cover_id;
  return {
    eyebrow: row.eyebrow.trim(),
    heading,
    intro,
    seo: {
      title: row.seo_title.trim() || heading,
      isTitleTyped: Boolean(row.seo_title.trim()),
      description: row.seo_description.trim() || intro,
      shareImageBase: shareId ? photoShareUrl(`${photosBaseUrl}/${shareId}`) : undefined,
    },
    cover: coverImage(row, photosBaseUrl, subject),
    dates: toPageDates(row.published_at, row.updated_at),
  };
};

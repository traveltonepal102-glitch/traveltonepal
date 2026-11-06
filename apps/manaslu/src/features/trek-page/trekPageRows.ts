import type { WebTrekPageRow, WebTrekRow } from "@ttn/site-data/database.types";
import { toPageDates } from "@ttn/site-data/pageDates";
import { firstText } from "@ttn/site-data/rowText";
import { photoShareUrl } from "@ttn/ui/lib/photos";

import type { HomeSeo, HomeTop } from "@/features/home/types";

/** A trek page's top: its headline (else its name) and summary, with the same buttons as the home page's. */
export const toTrekTop = (summary: WebTrekRow, page: WebTrekPageRow): HomeTop => ({
  eyebrow: "",
  heading: firstText(page.headline) ?? summary.name,
  intro: summary.summary.trim(),
  buttonLabel: "Plan my trek",
  secondLabel: "See the itinerary",
});

/** A trek page's Google result: the trek's own, else its name and summary. The share picture is its chosen one, else its cover. */
export const toTrekSeo = (summary: WebTrekRow, page: WebTrekPageRow, photosBaseUrl: string, isLive: boolean): HomeSeo => {
  const shareId = page.share_id ?? summary.cover_id;
  return {
    title: firstText(page.seo_title) ?? summary.name,
    description: firstText(page.seo_description) ?? summary.summary.trim(),
    shareImageBase: shareId ? photoShareUrl(`${photosBaseUrl}/${shareId}`) : undefined,
    isLive,
    dates: toPageDates(summary.published_at, summary.updated_at),
  };
};

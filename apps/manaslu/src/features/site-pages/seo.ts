import type { Metadata } from "next";

import { getHomeData } from "@/features/home/services/homeRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { pageMetadata } from "@/lib/pageMetadata";

import type { SitePageTop } from "./types";

/** A fixed page's tags: its Google result from Pages, with the website's own share picture when the page has none. */
export const sitePageMetadata = async (top: SitePageTop, path: string): Promise<Metadata> => {
  const [{ shareImageBase }, { seo }] = await Promise.all([getSiteSettings(), getHomeData()]);
  return pageMetadata({ path, title: top.seo.title, description: top.seo.description, shareImageBase: top.seo.shareImageBase ?? shareImageBase, dates: top.dates, isLive: seo.isLive });
};

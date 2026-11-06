import { datesJsonLd } from "@ttn/site-data/pageDates";
import type { Metadata } from "next";

import { getHomeData } from "@/features/home/services/homeRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { pageMetadata } from "@/lib/pageMetadata";
import { absoluteUrl } from "@/lib/site";

import { legalPage } from "./legalPages";
import { getLegalDoc } from "./services/legalRepository";
import type { LegalDoc, LegalSlug } from "./types";

/** A legal page's tags: its Google result, the website's own share picture, and listed only where it has search value. */
export const legalMetadata = async (slug: LegalSlug): Promise<Metadata> => {
  const [doc, { shareImageBase }, { seo }] = await Promise.all([getLegalDoc(slug), getSiteSettings(), getHomeData()]);
  const { path, isListed } = legalPage(slug);
  return pageMetadata({ path, title: doc.seo.title, description: doc.seo.description, shareImageBase, dates: doc.dates, isLive: seo.isLive, isListed });
};

/** The page and its dates. */
export const legalJsonLd = (doc: LegalDoc) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: absoluteUrl(legalPage(doc.slug).path),
  name: doc.seo.title,
  ...datesJsonLd(doc.dates),
});

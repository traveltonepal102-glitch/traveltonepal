import type { SiteCurrency, SiteLanguage } from "@ttn/config/siteLanguage";

import type { SiteKind } from "@/lib/supabase/database.types";

/** One website of the network; `id` is its SITE_ID. */
export type Site = {
  id: string;
  kind: SiteKind;
  regionId: string | null;
  name: string;
  /** e.g. "https://manaslutrek.com"; null until the domain is set up. */
  url: string | null;
  isLive: boolean;
  /** A region site's main trek, shown as its Home (Pages › Home); null until one is picked, and for the main site. */
  homeTrekId: string | null;
  position: number;
  /** The language its content is typed in and its currency for prices; fixed once the site is live. */
  language: SiteLanguage;
  currency: SiteCurrency;
};

/** A site's edit form. The id and region never change; the main site is always live. */
export type EditSiteValues = {
  name: string;
  /** "" until the domain is set up. */
  url: string;
  isLive: boolean;
  /** Sent only while the site isn't live (a live site's language and currency never change). */
  language?: SiteLanguage;
  currency?: SiteCurrency;
};

/** The "Add a site" form. A new site is always a region site and starts as a draft. */
export type NewSiteValues = {
  name: string;
  id: string;
  regionId: string;
  /** "" until the domain is set up. */
  url: string;
  language: SiteLanguage;
  currency: SiteCurrency;
};

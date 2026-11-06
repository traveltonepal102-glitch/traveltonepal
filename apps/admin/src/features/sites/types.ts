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
};

/** A site's edit form. The id and region never change; the main site is always live. */
export type EditSiteValues = {
  name: string;
  /** "" until the domain is set up. */
  url: string;
  isLive: boolean;
};

/** The "Add a site" form. A new site is always a region site and starts as a draft. */
export type NewSiteValues = {
  name: string;
  id: string;
  regionId: string;
  /** "" until the domain is set up. */
  url: string;
};

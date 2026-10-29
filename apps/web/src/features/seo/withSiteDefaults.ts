import type { Metadata } from "next";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { withPageSeoOverrides } from "./pageSeoOverrides";
import { getPageSeoOverrides } from "./services/pageSeoOverridesRepository";
import { withDefaultShareImage } from "./shareMetadata";

/**
 * A route's metadata (every generateMetadata) with what the admin sets for the whole site: the Site settings share
 * image when the page has no photo of its own, "Hide from Google", and the page's canonical address.
 */
export const withSiteDefaults = async (metadata: Metadata): Promise<Metadata> => {
  const [settings, overrides] = await Promise.all([getSiteSettings(), getPageSeoOverrides()]);
  return withPageSeoOverrides(withDefaultShareImage(metadata, settings.shareImage), overrides);
};

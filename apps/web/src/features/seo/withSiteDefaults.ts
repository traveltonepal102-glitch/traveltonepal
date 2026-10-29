import type { Metadata } from "next";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { withCanonicalOverride } from "./canonicals";
import { getCanonicalOverrides } from "./services/canonicalsRepository";
import { withDefaultShareImage } from "./shareMetadata";

/**
 * A route's metadata (every generateMetadata) with what the admin sets for the whole site: the Site settings share
 * image when the page has no photo of its own, and the page's canonical address when it names another page.
 */
export const withSiteDefaults = async (metadata: Metadata): Promise<Metadata> => {
  const [settings, canonicals] = await Promise.all([getSiteSettings(), getCanonicalOverrides()]);
  return withCanonicalOverride(withDefaultShareImage(metadata, settings.shareImage), canonicals);
};

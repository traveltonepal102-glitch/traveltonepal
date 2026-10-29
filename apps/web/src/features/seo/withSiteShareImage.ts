import type { Metadata } from "next";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { withDefaultShareImage } from "./shareMetadata";

/** A route's metadata, with the Site settings share image when the page has no photo of its own (every generateMetadata). */
export const withSiteShareImage = async (metadata: Metadata): Promise<Metadata> => withDefaultShareImage(metadata, (await getSiteSettings()).shareImage);

import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { SITE_ALTERNATE_NAMES, SITE_NAME, absoluteUrl } from "@/lib/site";

import { ORGANIZATION_ID } from "./organization";

/**
 * The site itself, for the site name Google shows above results and for searches by the brand's other spellings.
 * Google reads it on the home page only. No SearchAction: Google retired the sitelinks search box.
 */
export const websiteJsonLd = (): JsonLdData => ({
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAMES,
  url: absoluteUrl(ROUTES.home),
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
});

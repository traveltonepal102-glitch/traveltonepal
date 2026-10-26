import { JsonLd } from "@/components/shared/JsonLd";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { travelAgencyJsonLd } from "./organization";

/** The company's business details for Google, on every page (root layout), from Site settings. */
export const OrganizationJsonLd = async () => {
  const settings = await getSiteSettings();
  return <JsonLd data={{ "@context": "https://schema.org", ...travelAgencyJsonLd(settings) }} />;
};

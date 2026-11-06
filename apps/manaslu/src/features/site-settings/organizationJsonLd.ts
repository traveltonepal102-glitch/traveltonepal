import { absoluteUrl, SITE_NAME } from "@/lib/site";

import type { SiteSettings } from "./types";

/** The company as Google reads it (TravelAgency), from this website's Settings: blank details are left out. */
export const organizationJsonLd = ({ legalName, email, phoneDisplay, officeAddress, social, googleProfileUrl }: SiteSettings) => {
  const sameAs = [...social.map((link) => link.href), ...(googleProfileUrl ? [googleProfileUrl] : [])];
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo-footer.png"),
    ...(legalName ? { legalName } : {}),
    ...(email ? { email } : {}),
    ...(phoneDisplay ? { telephone: phoneDisplay } : {}),
    ...(officeAddress ? { address: { "@type": "PostalAddress", streetAddress: officeAddress, addressCountry: "NP" } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
};

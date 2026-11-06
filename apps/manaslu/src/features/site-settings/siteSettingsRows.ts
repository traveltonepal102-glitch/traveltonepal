import { officeDaysLabel, officeHoursLabel } from "@ttn/config/contact";
import type { WebSiteSettingsRow } from "@ttn/site-data/database.types";
import { photoShareUrl } from "@ttn/ui/lib/photos";

import type { SiteSettings } from "./types";

const clockOf = (value: string) => {
  const [hour = 0, minute = 0] = value.split(":").map(Number);
  return { hour, minute };
};

const secureUrl = (value: string) => (value.trim().startsWith("https://") ? value.trim() : "");

/** The web_site_settings row as the pages use it. A blank phone or address leaves its line out. */
export const toSiteSettings = (row: WebSiteSettingsRow, now: Date, photosBaseUrl: string): SiteSettings => {
  const phone = row.phone_number.trim();
  const code = row.phone_country_code.trim();
  const address = row.office_address.trim();
  const social = [
    { label: "Facebook", href: secureUrl(row.facebook_url) },
    { label: "Instagram", href: secureUrl(row.instagram_url) },
    { label: "YouTube", href: secureUrl(row.youtube_url) },
    { label: "LinkedIn", href: secureUrl(row.linkedin_url) },
    { label: "Tripadvisor", href: secureUrl(row.tripadvisor_url) },
  ];

  return {
    phoneDisplay: phone ? `+${code} ${phone}` : "",
    phoneDigits: phone ? `${code}${phone}`.replace(/\D/g, "") : "",
    email: row.email.trim(),
    officeAddress: address,
    // Hours have defaults in the database, so they say something only beside a real address.
    officeHours: address ? officeHoursLabel({ openDays: row.office_days, daysLabel: officeDaysLabel(row.office_days), opens: clockOf(row.office_opens), closes: clockOf(row.office_closes) }) : "",
    legalName: row.legal_name.trim(),
    legalForm: row.legal_form.trim(),
    licence: row.tourism_licence.trim(),
    tourismRegistration: row.tourism_registration.trim(),
    panNumber: row.pan_number.trim(),
    memberships: row.memberships.flatMap((membership) => membership.trim() || []),
    foundedYear: row.founded_year,
    shareImageBase: row.share_id ? photoShareUrl(`${photosBaseUrl}/${row.share_id}`) : undefined,
    certificate: row.certificate_id && row.certificate_variant_widths?.length
      ? { src: `${photosBaseUrl}/${row.certificate_id}`, alt: "Registration certificate", variantWidths: row.certificate_variant_widths, fileName: row.certificate_file_name || undefined }
      : undefined,
    social: social.filter((link) => link.href),
    googleProfileUrl: secureUrl(row.google_business_url),
    googleWriteUrl: secureUrl(row.google_review_url),
    year: now.getUTCFullYear(),
  };
};

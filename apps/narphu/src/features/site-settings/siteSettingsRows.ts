import { officeDaysLabel, officeHoursLabel } from "@ttn/config/contact";
import type { OfficeSchedule } from "@ttn/config/contact";
import { isGoogleMapsEmbedUrl } from "@ttn/config/googleMaps";
import type { WebSiteSettingsRow } from "@ttn/site-data/database.types";
import { photoShareUrl } from "@ttn/ui/lib/photos";

import type { SiteSettings } from "./types";

const clockOf = (value: string) => {
  const [hour = 0, minute = 0] = value.split(":").map(Number);
  return { hour, minute };
};

const secureUrl = (value: string) => (value.trim().startsWith("https://") ? value.trim() : "");

const scanOf = (id: string | null, widths: number[] | null, fileName: string | null | undefined, alt: string, photosBaseUrl: string) =>
  id && widths?.length ? { src: `${photosBaseUrl}/${id}`, alt, variantWidths: widths, fileName: fileName || undefined } : undefined;

/** The web_site_settings row as the pages use it. A blank phone or address leaves its line out. */
export const toSiteSettings = (row: WebSiteSettingsRow, now: Date, photosBaseUrl: string): SiteSettings => {
  const phone = row.phone_number.trim();
  const code = row.phone_country_code.trim();
  const address = row.office_address.trim();
  const embedUrl = row.google_maps_embed_url.trim();
  const schedule: OfficeSchedule = { openDays: row.office_days, daysLabel: officeDaysLabel(row.office_days), opens: clockOf(row.office_opens), closes: clockOf(row.office_closes) };
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
    officeHours: address ? officeHoursLabel(schedule) : "",
    schedule,
    officeMap: { url: secureUrl(row.google_maps_url), embedUrl: isGoogleMapsEmbedUrl(embedUrl) ? embedUrl : "" },
    replyLanguages: row.reply_languages.flatMap((language) => language.trim() || []),
    legalName: row.legal_name.trim(),
    legalForm: row.legal_form.trim(),
    licence: row.tourism_licence.trim(),
    tourismRegistration: row.tourism_registration.trim(),
    panNumber: row.pan_number.trim(),
    staffInsurer: row.staff_insurer.trim(),
    memberships: row.memberships.flatMap((membership) => membership.trim() || []),
    foundedYear: row.founded_year,
    shareImageBase: row.share_id ? photoShareUrl(`${photosBaseUrl}/${row.share_id}`) : undefined,
    certificate: scanOf(row.certificate_id, row.certificate_variant_widths, row.certificate_file_name, "Registration certificate", photosBaseUrl),
    panCertificate: scanOf(row.pan_certificate_id, row.pan_certificate_variant_widths, row.pan_certificate_file_name, "PAN registration certificate", photosBaseUrl),
    social: social.filter((link) => link.href),
    googleProfileUrl: secureUrl(row.google_business_url),
    googleWriteUrl: secureUrl(row.google_review_url),
    year: now.getUTCFullYear(),
  };
};

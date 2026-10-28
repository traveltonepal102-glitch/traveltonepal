import { officeDaysLabel, officeHoursLabel } from "@ttn/config/contact";
import type { ClockTime, OfficeSchedule } from "@ttn/config/contact";

import { coverImage } from "@/lib/images";
import type { WebSiteSettingsRow } from "@/lib/supabase/database.types";
import { SITE_NAME } from "@/lib/site";

import type { SiteSettings, SocialNetwork } from "./types";

/** "09:30" → { hour: 9, minute: 30 }; anything else is the fallback. */
const clockOf = (value: string, fallback: ClockTime): ClockTime => {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  return match ? { hour: Number(match[1]), minute: Number(match[2]) } : fallback;
};

const SOCIAL: readonly { key: keyof WebSiteSettingsRow; network: SocialNetwork; label: string }[] = [
  { key: "facebook_url", network: "facebook", label: "Facebook" },
  { key: "instagram_url", network: "instagram", label: "Instagram" },
  { key: "youtube_url", network: "youtube", label: "YouTube" },
  { key: "linkedin_url", network: "linkedin", label: "LinkedIn" },
  { key: "tripadvisor_url", network: "tripadvisor", label: "Tripadvisor" },
  { key: "google_business_url", network: "google", label: "Google" },
];

/** A Site settings link, or "" unless it is a secure address. */
const secureUrl = (value: string) => {
  const url = value.trim();
  return url.startsWith("https://") ? url : "";
};

/** The web_site_settings row as the pages use it; blank texts stay blank (pages leave those lines out). */
export const toSiteSettings = (row: WebSiteSettingsRow, photosBaseUrl: string): SiteSettings => {
  const schedule: OfficeSchedule = {
    openDays: row.office_days,
    daysLabel: officeDaysLabel(row.office_days),
    opens: clockOf(row.office_opens, { hour: 9, minute: 0 }),
    closes: clockOf(row.office_closes, { hour: 18, minute: 0 }),
  };
  const local = row.phone_number.trim();
  const code = row.phone_country_code.trim();

  return {
    contact: {
      email: row.email.trim(),
      phoneDisplay: local ? `+${code} ${local}` : "",
      phoneDigits: local ? `${code}${local}` : "",
      officeAddress: row.office_address.trim(),
      officeHours: officeHoursLabel(schedule),
      registrationNumber: row.tourism_registration.trim(),
      taanMemberNumber: row.taan_number.trim(),
    },
    schedule,
    replyLanguages: row.reply_languages,
    company: {
      legalName: row.legal_name.trim(),
      legalForm: row.legal_form.trim(),
      foundedYear: row.founded_year ?? undefined,
      tourismRegistration: row.tourism_registration.trim(),
      tourismLicence: row.tourism_licence.trim(),
      companyRegistration: row.company_registration.trim(),
      panNumber: row.pan_number.trim(),
      taanNumber: row.taan_number.trim(),
      memberships: row.memberships,
      staffInsurer: row.staff_insurer.trim(),
      paymentsNote: row.payments_note.trim(),
      certificate: coverImage(
        {
          cover_id: row.certificate_id,
          cover_width: row.certificate_width,
          cover_height: row.certificate_height,
          cover_variant_widths: row.certificate_variant_widths,
          cover_placeholder: null,
          cover_place: null,
        },
        photosBaseUrl,
        "Department of Tourism registration certificate",
        `${SITE_NAME}'s Department of Tourism registration certificate`,
      ),
      panCertificate: coverImage(
        {
          cover_id: row.pan_certificate_id,
          cover_width: row.pan_certificate_width,
          cover_height: row.pan_certificate_height,
          cover_variant_widths: row.pan_certificate_variant_widths,
          cover_placeholder: null,
          cover_place: null,
        },
        photosBaseUrl,
        "PAN registration certificate",
        `${SITE_NAME}'s PAN registration certificate from the Inland Revenue Department, Nepal`,
      ),
    },
    social: SOCIAL.flatMap(({ key, network, label }) => {
      const url = secureUrl(String(row[key] ?? ""));
      return url ? [{ network, label, url }] : [];
    }),
    googleReviews: { writeUrl: secureUrl(row.google_review_url), profileUrl: secureUrl(row.google_business_url) },
    shareImage: coverImage(
      { cover_id: row.share_id, cover_width: null, cover_height: null, cover_variant_widths: row.share_variant_widths, cover_placeholder: null, cover_place: null },
      photosBaseUrl,
      SITE_NAME,
      SITE_NAME,
    ),
  };
};

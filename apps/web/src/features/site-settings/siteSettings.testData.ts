import type { WebSiteSettingsRow } from "@/lib/supabase/database.types";

import { toSiteSettings } from "./siteSettingsRows";

export const PHOTOS_BASE_URL = "https://photos.example/photos";

/** A web_site_settings row as the database returns it: some numbers typed in, some still blank. */
export const SITE_SETTINGS_ROW: WebSiteSettingsRow = {
  phone_country_code: "977",
  phone_number: " 9843197197 ",
  email: "hello@example.com",
  office_address: "Thamel, Kathmandu, Nepal",
  office_days: [0, 1, 2, 3, 4, 5],
  office_opens: "09:00",
  office_closes: "18:00",
  reply_languages: ["English", "Nepali"],
  legal_name: "Travel To Nepal",
  legal_form: "Pvt. Ltd.",
  founded_year: 2015,
  tourism_registration: "1234/079",
  tourism_licence: "",
  company_registration: "",
  pan_number: "",
  taan_number: "2001",
  memberships: ["TAAN", "NMA"],
  staff_insurer: "",
  payments_note: "",
  facebook_url: "https://facebook.com/traveltonepal",
  instagram_url: "",
  youtube_url: "http://youtube.com/not-secure",
  tripadvisor_url: "",
  google_business_url: "https://g.page/traveltonepal",
  certificate_id: null,
  certificate_width: null,
  certificate_height: null,
  certificate_variant_widths: null,
  share_id: "c0ffee00-0000-4000-8000-000000000001",
  share_variant_widths: [640, 1280],
  updated_at: "2026-10-26T08:00:00Z",
  linkedin_url: "https://www.linkedin.com/company/traveltonepal",
  google_review_url: "https://g.page/r/traveltonepal/review",
  pan_certificate_id: null,
  pan_certificate_width: null,
  pan_certificate_height: null,
  pan_certificate_variant_widths: null,
};

export const SITE_SETTINGS = toSiteSettings(SITE_SETTINGS_ROW, PHOTOS_BASE_URL);

import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { SiteSettings, SiteSettingsValues } from "../types";

const COLUMNS = `*,
  certificate:photos!site_settings_certificate_photo_id_fkey(${PHOTO_COLUMNS}),
  panCertificate:photos!site_settings_pan_certificate_photo_id_fkey(${PHOTO_COLUMNS}),
  share:photos!site_settings_share_photo_id_fkey(${PHOTO_COLUMNS})` as const;

/** Site settings (one row). Throws when the database can't be read. */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select(COLUMNS).single();
  if (error) throw new Error(`Could not load the site settings: ${error.message}`);

  return {
    phoneCountryCode: data.phone_country_code,
    phoneNumber: data.phone_number,
    email: data.email,
    officeAddress: data.office_address,
    officeDays: data.office_days,
    officeOpens: data.office_opens.slice(0, 5),
    officeCloses: data.office_closes.slice(0, 5),
    replyLanguages: data.reply_languages,
    legalName: data.legal_name,
    legalForm: data.legal_form,
    foundedYear: data.founded_year,
    tourismRegistration: data.tourism_registration,
    tourismLicence: data.tourism_licence,
    companyRegistration: data.company_registration,
    panNumber: data.pan_number,
    taanNumber: data.taan_number,
    memberships: data.memberships,
    staffInsurer: data.staff_insurer,
    paymentsNote: data.payments_note,
    certificatePhotoId: data.certificate_photo_id,
    panCertificatePhotoId: data.pan_certificate_photo_id,
    facebookUrl: data.facebook_url,
    instagramUrl: data.instagram_url,
    youtubeUrl: data.youtube_url,
    tripadvisorUrl: data.tripadvisor_url,
    googleBusinessUrl: data.google_business_url,
    linkedinUrl: data.linkedin_url,
    googleReviewUrl: data.google_review_url,
    sharePhotoId: data.share_photo_id,
    certificatePhoto: data.certificate ? toPhoto(data.certificate) : null,
    panCertificatePhoto: data.panCertificate ? toPhoto(data.panCertificate) : null,
    sharePhoto: data.share ? toPhoto(data.share) : null,
    updatedAt: data.updated_at,
  };
};

/** "forbidden": only a Super admin may change the settings (Row Level Security decides). */
export type SaveSettingsResult = { ok: true } | { ok: false; reason: "forbidden" | "missing_photo" | "failed" };

const RLS_VIOLATION = "42501";
const FOREIGN_KEY_VIOLATION = "23503";

/** Saves the Site settings in one statement (save_site_settings). */
export const saveSiteSettings = async (values: SiteSettingsValues): Promise<SaveSettingsResult> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_site_settings", {
    p_settings: {
      phone_country_code: values.phoneCountryCode,
      phone_number: values.phoneNumber,
      email: values.email,
      office_address: values.officeAddress,
      office_days: values.officeDays,
      office_opens: values.officeOpens,
      office_closes: values.officeCloses,
      reply_languages: values.replyLanguages,
      legal_name: values.legalName,
      legal_form: values.legalForm,
      founded_year: values.foundedYear,
      tourism_registration: values.tourismRegistration,
      tourism_licence: values.tourismLicence,
      company_registration: values.companyRegistration,
      pan_number: values.panNumber,
      taan_number: values.taanNumber,
      memberships: values.memberships,
      staff_insurer: values.staffInsurer,
      payments_note: values.paymentsNote,
      certificate_photo_id: values.certificatePhotoId ?? "",
      pan_certificate_photo_id: values.panCertificatePhotoId ?? "",
      facebook_url: values.facebookUrl,
      instagram_url: values.instagramUrl,
      youtube_url: values.youtubeUrl,
      tripadvisor_url: values.tripadvisorUrl,
      google_business_url: values.googleBusinessUrl,
      linkedin_url: values.linkedinUrl,
      google_review_url: values.googleReviewUrl,
      share_photo_id: values.sharePhotoId ?? "",
    },
  });

  if (!error) return { ok: true };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_photo" };
  console.error(`save_site_settings failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

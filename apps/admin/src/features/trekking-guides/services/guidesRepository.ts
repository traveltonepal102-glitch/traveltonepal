import "server-only";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { GUIDE_CERTIFICATE_VALUES, GUIDE_LOCALE } from "../constants";
import type { TrekkingGuide, TrekkingGuideFormValues } from "../types";

/** Postgres error codes the save can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const GUIDE_COLUMNS = `*,
  photo:photos!trekking_guides_photo_id_fkey(${PHOTO_COLUMNS}),
  trekking_guide_translations!inner(*),
  trekking_guide_regions(region_id),
  trek_guides(trek_id)` as const;

/** Stored certificates as the form knows them (the database checks the same names). */
const certificatesSchema = z.array(z.enum(GUIDE_CERTIFICATE_VALUES)).catch([]);

/** A stored month's first day ("2027-03-01") → the form's month ("2027-03"). */
const toMonth = (date: string | null) => date?.slice(0, 7) ?? null;
const toDate = (month: string | null) => (month ? `${month}-01` : "");

/** Trek names in English by id, to list where each guide is used. */
const trekNames = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("treks").select("id, trek_translations!inner(name)").eq("trek_translations.locale", GUIDE_LOCALE);
  if (error) throw new Error(`Could not load trek names: ${error.message}`);
  return new Map(data.map((trek) => [trek.id, trek.trek_translations[0]?.name ?? ""]));
};

/** Every guide with its English text, A–Z. Throws when the database can't be read. */
export const listTrekkingGuides = async (): Promise<TrekkingGuide[]> => {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, names] = await Promise.all([
    supabase.from("trekking_guides").select(GUIDE_COLUMNS).eq("trekking_guide_translations.locale", GUIDE_LOCALE),
    trekNames(),
  ]);
  if (error) throw new Error(`Could not load trekking guides: ${error.message}`);

  return data
    .map((row): TrekkingGuide => {
      const [text] = row.trekking_guide_translations;
      return {
        id: row.id,
        updatedAt: row.updated_at,
        name: row.name,
        photo: row.photo ? toPhoto(row.photo) : null,
        photoConsent: row.photo_consent,
        role: text?.role ?? "",
        bio: text?.bio ?? "",
        quote: text?.quote ?? "",
        homeVillage: row.home_village,
        homeDistrict: row.home_district,
        age: row.age,
        yearsGuiding: row.years_guiding,
        badge: row.badge,
        languages: row.languages,
        regionIds: row.trekking_guide_regions.map((region) => region.region_id),
        licenceNumber: row.licence_number,
        licenceValidUntil: toMonth(row.licence_valid_until),
        certificates: certificatesSchema.parse(row.certificates),
        wfrValidUntil: toMonth(row.wfr_valid_until),
        firstAidValidUntil: toMonth(row.first_aid_valid_until),
        showOnAbout: row.show_on_about,
        canLeadTreks: row.can_lead_treks,
        canFactCheck: row.can_fact_check,
        treks: row.trek_guides
          .map((item) => ({ id: item.trek_id, name: names.get(item.trek_id) ?? "" }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export type SaveGuideResult = { ok: true; guideId: string } | { ok: false; reason: "missing_link" | "not_found" | "forbidden" | "failed" };

/** Adds (guideId null) or updates a guide, its English text and its regions in one transaction. */
export const saveTrekkingGuide = async (values: TrekkingGuideFormValues, guideId: string | null): Promise<SaveGuideResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_trekking_guide", {
    p_guide_id: guideId,
    p_locale: GUIDE_LOCALE,
    p_guide: {
      name: values.name,
      photo_id: values.photoId ?? "",
      photo_consent: values.photoConsent,
      home_village: values.homeVillage,
      home_district: values.homeDistrict,
      age: values.age,
      years_guiding: values.yearsGuiding,
      badge: values.badge,
      languages: values.languages,
      licence_number: values.licenceNumber,
      licence_valid_until: toDate(values.licenceValidUntil),
      certificates: values.certificates,
      wfr_valid_until: toDate(values.wfrValidUntil),
      first_aid_valid_until: toDate(values.firstAidValidUntil),
      show_on_about: values.showOnAbout,
      can_lead_treks: values.canLeadTreks,
      can_fact_check: values.canFactCheck,
    },
    p_text: { role: values.role, bio: values.bio, quote: values.quote },
    p_region_ids: values.regionIds,
  });

  if (!error) return { ok: true, guideId: data };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_link" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_trekking_guide failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/** Removes a guide (and takes it off every trek). False when nothing was removed: no such guide, or not allowed (RLS). */
export const removeTrekkingGuide = async (guideId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("trekking_guides").delete().eq("id", guideId).select("id");
  if (error) throw new Error(`Could not remove guide ${guideId}: ${error.message}`);
  return data.length > 0;
};

import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTICLE_LOCALE } from "../constants";
import type { ArticleOptions } from "../types";

/** How many library photos the editor offers at once (newest first). */
const LIBRARY_LIMIT = 300;

/** Every trekking guide, A–Z, for the guide sections (with the regions they lead, to suggest them first). */
export const listSectionGuides = async (): Promise<ArticleOptions["guides"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("trekking_guides")
    .select(`id, name, photo_consent, photo:photos!trekking_guides_photo_id_fkey(${PHOTO_COLUMNS}), trekking_guide_translations!inner(role), trekking_guide_regions(region_id)`)
    .eq("trekking_guide_translations.locale", ARTICLE_LOCALE);
  if (error) throw new Error(`Could not load trekking guides: ${error.message}`);

  return data
    .map((guide) => ({
      id: guide.id,
      name: guide.name,
      role: guide.trekking_guide_translations[0]?.role ?? "",
      photo: guide.photo ? toPhoto(guide.photo) : null,
      regionIds: guide.trekking_guide_regions.map((region) => region.region_id),
      hasConsent: guide.photo_consent,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/** The photo library, newest first, for "Photo" and "Photo gallery". */
export const listLibraryPhotos = async (): Promise<ArticleOptions["photos"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("photos").select(PHOTO_COLUMNS).order("created_at", { ascending: false }).limit(LIBRARY_LIMIT);
  if (error) throw new Error(`Could not load the photo library: ${error.message}`);
  return data.map(toPhoto);
};

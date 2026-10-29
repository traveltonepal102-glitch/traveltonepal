import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import type { Photo } from "@/features/photos/types";
import type { Database, Json, SitePageSlug } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { legalContentOf } from "../lib/pageContent";
import type { LegalPagesValues, ListPagesValues, PageTopValues, SitePage } from "../types";

type PageRow = Database["public"]["Tables"]["site_pages"]["Row"];

/** Selects the page's share photo with the row. */
const SHARE_COLUMNS = `share:photos!site_pages_share_photo_id_fkey(${PHOTO_COLUMNS})` as const;

/** The top of the page and its Google result, as the forms edit them. */
const toPageTop = (row: PageRow): PageTopValues => ({
  eyebrow: row.eyebrow,
  heading: row.heading,
  intro: row.intro,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  seoKeyword: row.seo_keyword,
  photoId: row.photo_id,
  sharePhotoId: row.share_photo_id,
  canonicalPath: row.canonical_path,
  hideFromGoogle: row.hide_from_google,
});

/** When each page was last saved, for the Pages list. Throws when the database can't be read. */
export const listPageUpdates = async (): Promise<Partial<Record<SitePageSlug, string>>> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_pages").select("slug, updated_at");
  if (error) throw new Error(`Could not load the pages: ${error.message}`);
  return Object.fromEntries(data.map((row) => [row.slug, row.updated_at]));
};

/** One page with its photos (by place), or null when it has no row. Throws when the database can't be read. */
export const getSitePage = async (slug: SitePageSlug): Promise<SitePage | null> => {
  const supabase = await createSupabaseServerClient();
  const [page, photos] = await Promise.all([
    supabase.from("site_pages").select(`*, photo:photos!site_pages_photo_id_fkey(${PHOTO_COLUMNS}), ${SHARE_COLUMNS}`).eq("slug", slug).maybeSingle(),
    supabase.from("site_page_photos").select(`position, photo:photos!site_page_photos_photo_id_fkey(${PHOTO_COLUMNS})`).eq("page_slug", slug).order("position"),
  ]);
  if (page.error) throw new Error(`Could not load the ${slug} page: ${page.error.message}`);
  if (photos.error) throw new Error(`Could not load the ${slug} page's photos: ${photos.error.message}`);
  const row = page.data;
  if (!row) return null;

  return {
    slug: row.slug,
    top: toPageTop(row),
    photo: row.photo ? toPhoto(row.photo) : null,
    sharePhoto: row.share ? toPhoto(row.share) : null,
    founderAuthorId: row.founder_author_id,
    photoSlots: photos.data.reduce<(Photo | null)[]>((slots, item) => {
      slots[item.position - 1] = item.photo ? toPhoto(item.photo) : null;
      return slots;
    }, []),
    content: row.content,
    updatedAt: row.updated_at,
  };
};

/** Several pages without their photos (the list pages have none) but with their share photo, in any order. Throws when the database can't be read. */
export const getSitePages = async (slugs: readonly SitePageSlug[]): Promise<SitePage[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_pages").select(`*, ${SHARE_COLUMNS}`).in("slug", [...slugs]);
  if (error) throw new Error(`Could not load the pages: ${error.message}`);
  return data.map((row) => ({
    slug: row.slug,
    top: toPageTop(row),
    photo: null,
    sharePhoto: row.share ? toPhoto(row.share) : null,
    founderAuthorId: row.founder_author_id,
    photoSlots: [],
    content: row.content,
    updatedAt: row.updated_at,
  }));
};

export type SavePageResult = { ok: true } | { ok: false; reason: "forbidden" | "missing_photo" | "founder" | "failed" };

const RLS_VIOLATION = "42501";
const FOREIGN_KEY_VIOLATION = "23503";
const INVALID_VALUE = "22023";

/** `photoIds`: the page's photos by place, null for an empty place. */
type SavePageInput = PageTopValues & { founderAuthorId?: string | null; photoIds?: (string | null)[]; content: Json };

/** A page as save_site_page takes it. */
const toPagePayload = (page: SavePageInput) => ({
  eyebrow: page.eyebrow,
  heading: page.heading,
  intro: page.intro,
  seo_title: page.seoTitle,
  seo_description: page.seoDescription,
  seo_keyword: page.seoKeyword,
  photo_id: page.photoId ?? "",
  share_photo_id: page.sharePhotoId ?? "",
  canonical_path: page.canonicalPath,
  hide_from_google: page.hideFromGoogle,
  founder_author_id: page.founderAuthorId ?? "",
  content: page.content,
});

const toSaveResult = (functionName: string, error: { code: string; message: string } | null): SavePageResult => {
  if (!error) return { ok: true };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_photo" };
  if (error.code === INVALID_VALUE) return { ok: false, reason: "founder" };
  console.error(`${functionName} failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/** Saves a page in one transaction (save_site_page): its top, Google result, own parts and photos. */
export const saveSitePage = async (slug: SitePageSlug, page: SavePageInput): Promise<SavePageResult> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_site_page", { p_slug: slug, p_page: toPagePayload(page), p_photo_ids: (page.photoIds ?? []).map((id) => id ?? "") });
  return toSaveResult("save_site_page", error);
};

/** Saves several pages together, in one transaction (save_site_pages), e.g. the four list or legal pages. */
const saveSitePages = async (pages: Partial<Record<SitePageSlug, SavePageInput>>): Promise<SavePageResult> => {
  const supabase = await createSupabaseServerClient();
  const payload = Object.fromEntries(Object.entries(pages).map(([slug, page]) => [slug, toPagePayload(page)]));
  const { error } = await supabase.rpc("save_site_pages", { p_pages: payload });
  return toSaveResult("save_site_pages", error);
};

/** The four list pages: their tops and Google results (no photo, no own parts). */
export const saveListPages = (pages: ListPagesValues): Promise<SavePageResult> =>
  saveSitePages(Object.fromEntries(Object.entries(pages).map(([slug, page]) => [slug, { ...page, photoId: null, content: {} }])));

/** The four legal pages: title, intro and their text, lawyer check and date (no photos, no Google result: title and intro). */
export const saveLegalPages = (pages: LegalPagesValues): Promise<SavePageResult> =>
  saveSitePages(
    Object.fromEntries(
      Object.entries(pages).map(([slug, page]) => [
        slug,
        { eyebrow: "", heading: page.heading, intro: page.intro, seoTitle: "", seoDescription: "", seoKeyword: "", photoId: null, sharePhotoId: null, canonicalPath: "", hideFromGoogle: false, content: legalContentOf(page) },
      ]),
    ),
  );

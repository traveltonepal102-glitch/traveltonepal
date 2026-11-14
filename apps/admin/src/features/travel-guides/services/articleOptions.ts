import "server-only";

import { MAIN_SITE_ID } from "@ttn/config/sites";

import { listPhotosByIds } from "@/features/photos/services/photoPickerRepository";
import { siteDomain } from "@/features/sites/lib/pickCurrentSite";
import type { Site } from "@/features/sites/types";
import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { trekFilesBaseUrl } from "@/lib/storage/trekFiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTICLE_LOCALE } from "../constants";
import type { ArticleListItem, RegionArticleItem } from "../lib/articleListItem";
import type { ArticleOptions } from "../types";
import { listFeedbackTotals } from "./guideFeedbackRepository";
import { listSectionGuides } from "./sectionOptions";

const byName = <Item extends { name: string }>(items: Item[]) => items.sort((a, b) => a.name.localeCompare(b.name));

/** The regions a guide can show on, A–Z. */
const listGuideRegions = async (): Promise<ArticleOptions["regions"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("regions").select("id, region_translations!inner(name)").eq("region_translations.locale", ARTICLE_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);
  return byName(data.map((region) => ({ id: region.id, name: region.region_translations[0]?.name ?? "" })));
};

/** The website's authors A–Z (a guide author named by their guide), with what the editor checks. */
export const listAuthorOptions = async (siteId: string): Promise<ArticleOptions["authors"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("authors")
    .select("id, kind, name, writes_in, guide:trekking_guides!authors_guide_id_fkey(name), author_translations!inner(job_title)")
    .eq("site_id", siteId)
    .eq("author_translations.locale", ARTICLE_LOCALE);
  if (error) throw new Error(`Could not load authors: ${error.message}`);
  return byName(
    data.map((author) => ({
      id: author.id,
      name: author.kind === "guide" ? (author.guide?.name ?? "") : author.name,
      jobTitle: author.author_translations[0]?.job_title ?? "",
      isVerified: author.kind !== "guest",
      isGuest: author.kind === "guest",
      writesEnglish: author.writes_in.includes(ARTICLE_LOCALE),
    })),
  );
};

/** Everything else the editor offers: the website's treks, its other travel guides, and its guides who can check travel guides. */
const listArticleOptions = async (siteId: string, exceptArticleId: string | null): Promise<Omit<ArticleOptions, "site" | "regions" | "authors" | "guides" | "photos" | "filesBaseUrl">> => {
  const supabase = await createSupabaseServerClient();
  const [treks, checkers, articles] = await Promise.all([
    supabase
      .from("treks")
      .select(
        `id, days, difficulty, max_altitude_m, region_id, cover:photos!treks_cover_photo_id_fkey(${PHOTO_COLUMNS}), trek_translations!inner(name),
        trek_group_prices(price_usd, is_default), trek_days(id, position, altitude_m, trek_day_translations(locale, title, duration))`,
      )
      .eq("site_id", siteId)
      .eq("trek_translations.locale", ARTICLE_LOCALE),
    supabase
      .from("trekking_guides")
      .select("id, name, trekking_guide_translations!inner(role)")
      .eq("site_id", siteId)
      .eq("can_fact_check", true)
      .eq("photo_consent", true)
      .eq("trekking_guide_translations.locale", ARTICLE_LOCALE),
    supabase.from("articles").select("id, article_translations!inner(title)").eq("site_id", siteId).eq("article_translations.locale", ARTICLE_LOCALE),
  ]);
  const error = treks.error ?? checkers.error ?? articles.error;
  if (error) throw new Error(`Could not load the travel guide choices: ${error.message}`);

  return {
    treks: byName(
      (treks.data ?? []).map((trek) => ({
        id: trek.id,
        name: trek.trek_translations[0]?.name ?? "",
        days: trek.days,
        difficulty: trek.difficulty,
        maxAltitudeM: trek.max_altitude_m,
        // "From $…": the group price marked "Most popular", as on the trek page.
        priceFromUsd: trek.trek_group_prices.find((price) => price.is_default)?.price_usd ?? null,
        cover: trek.cover ? toPhoto(trek.cover) : null,
        regionId: trek.region_id,
        itinerary: [...trek.trek_days]
          .sort((a, b) => a.position - b.position)
          .map((day, index) => {
            const text = day.trek_day_translations.find((item) => item.locale === ARTICLE_LOCALE);
            return { id: day.id, number: index + 1, title: text?.title ?? "", duration: text?.duration ?? "", altitudeM: day.altitude_m };
          }),
      })),
    ),
    checkers: byName((checkers.data ?? []).map((guide) => ({ id: guide.id, name: guide.name, role: guide.trekking_guide_translations[0]?.role ?? "" }))),
    articles: (articles.data ?? [])
      .filter((article) => article.id !== exceptArticleId)
      .map((article) => ({ id: article.id, title: article.article_translations[0]?.title ?? "" }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  };
};

/** The website's travel guides for the list, most recently edited first. Throws when the database can't be read. */
export const listArticles = async (siteId: string): Promise<ArticleListItem[]> => {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, feedback] = await Promise.all([
    supabase
      .from("articles")
      .select(
        `id, topic, status, author_id, published_on, is_featured, start_here_position, updated_at,
        cover:photos!articles_cover_photo_id_fkey(${PHOTO_COLUMNS}), article_translations!inner(title)`,
      )
      .eq("site_id", siteId)
      .eq("article_translations.locale", ARTICLE_LOCALE)
      .order("updated_at", { ascending: false }),
    listFeedbackTotals(),
  ]);
  if (error) throw new Error(`Could not load travel guides: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    title: row.article_translations[0]?.title ?? "",
    topic: row.topic,
    status: row.status,
    authorId: row.author_id,
    publishedOn: row.published_on,
    isFeatured: row.is_featured,
    startHerePosition: row.start_here_position,
    updatedAt: row.updated_at,
    cover: row.cover ? toPhoto(row.cover) : null,
    feedback: feedback.get(row.id) ?? null,
  }));
};

/** Travel To Nepal's travel guides about a region (the region ticked in its settings), any status, most recently edited first. */
export const listRegionArticles = async (regionId: string): Promise<RegionArticleItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(`id, topic, status, published_on, cover:photos!articles_cover_photo_id_fkey(${PHOTO_COLUMNS}), article_translations!inner(title), article_regions!inner(region_id)`)
    .eq("site_id", MAIN_SITE_ID)
    .eq("article_translations.locale", ARTICLE_LOCALE)
    .eq("article_regions.region_id", regionId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load the travel guides about region ${regionId}: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    title: row.article_translations[0]?.title ?? "",
    topic: row.topic,
    status: row.status,
    publishedOn: row.published_on,
    cover: row.cover ? toPhoto(row.cover) : null,
  }));
};

/**
 * Everything the editor offers for a guide of this website, in one go (`exceptArticleId`: the guide being edited,
 * left out of "Keep reading"; `photoIds`: the photos its sections show, for their previews).
 */
export const getArticleOptions = async (site: Site, exceptArticleId: string | null, photoIds: string[] = []): Promise<ArticleOptions> => {
  const [regions, authors, rest, guides, photos] = await Promise.all([
    listGuideRegions(),
    listAuthorOptions(site.id),
    listArticleOptions(site.id, exceptArticleId),
    listSectionGuides(site.id),
    listPhotosByIds(photoIds),
  ]);
  const domain = siteDomain(site) ?? `[${site.name} website]`;
  return {
    ...rest,
    site: {
      domain,
      addressPrefix: site.kind === "main" ? `${domain}/guides/` : `${domain}/`,
      region: regions.find((region) => region.id === site.regionId) ?? null,
    },
    authors,
    guides,
    photos,
    regions,
    filesBaseUrl: trekFilesBaseUrl,
  };
};

/** The website's published travel guides, A–Z, as choices for a trek’s "Blog posts on this trek’s page". */
export const listPublishedArticleChoices = async (siteId: string): Promise<{ value: string; label: string }[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, article_translations!inner(title)")
    .eq("site_id", siteId)
    .eq("status", "published")
    .eq("article_translations.locale", ARTICLE_LOCALE);
  if (error) throw new Error(`Could not load the published travel guides of ${siteId}: ${error.message}`);
  return data
    .map((row) => ({ value: row.id, label: row.article_translations[0]?.title ?? "" }))
    .filter((choice) => choice.label)
    .sort((a, b) => a.label.localeCompare(b.label));
};

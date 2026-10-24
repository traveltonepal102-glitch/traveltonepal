import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTICLE_LOCALE } from "../constants";
import type { ArticleListItem } from "../lib/articleListItem";
import type { ArticleOptions } from "../types";
import { listLibraryPhotos, listSectionGuides } from "./sectionOptions";

const byName = <Item extends { name: string }>(items: Item[]) => items.sort((a, b) => a.name.localeCompare(b.name));

/** The region websites (and the regions a guide can show on), A–Z. A site without its domain yet shows "[slug] site". */
export const listSiteOptions = async (): Promise<ArticleOptions["sites"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select("id, slug, website_domain, region_translations!inner(name)")
    .eq("region_translations.locale", ARTICLE_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);
  return byName(
    data.map((region) => ({ id: region.id, name: region.region_translations[0]?.name ?? "", domain: region.website_domain ?? `[${region.slug} site]` })),
  );
};

/** Authors A–Z (a guide author named by their guide), with what the editor checks. */
export const listAuthorOptions = async (): Promise<ArticleOptions["authors"]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("authors")
    .select("id, kind, name, writes_in, guide:trekking_guides!authors_guide_id_fkey(name), author_translations!inner(job_title)")
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

/** Everything else the editor offers: treks, guides who can check travel guides, and the other travel guides. */
export const listArticleOptions = async (exceptArticleId: string | null): Promise<Omit<ArticleOptions, "sites" | "regions" | "authors" | "guides" | "photos">> => {
  const supabase = await createSupabaseServerClient();
  const [treks, checkers, articles] = await Promise.all([
    supabase
      .from("treks")
      .select(
        `id, days, difficulty, max_altitude_m, region_id, cover:photos!treks_cover_photo_id_fkey(${PHOTO_COLUMNS}), trek_translations!inner(name),
        trek_group_prices(price_usd, is_default), trek_days(id, position, altitude_m, trek_day_translations(locale, title, duration))`,
      )
      .eq("trek_translations.locale", ARTICLE_LOCALE),
    supabase
      .from("trekking_guides")
      .select("id, name, trekking_guide_translations!inner(role)")
      .eq("can_fact_check", true)
      .eq("photo_consent", true)
      .eq("trekking_guide_translations.locale", ARTICLE_LOCALE),
    supabase.from("articles").select("id, article_translations!inner(title)").eq("article_translations.locale", ARTICLE_LOCALE),
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

/** Every travel guide for the list, most recently edited first. Throws when the database can't be read. */
export const listArticles = async (): Promise<ArticleListItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `id, topic, status, site_region_id, author_id, published_on, is_featured, start_here_position, updated_at,
      cover:photos!articles_cover_photo_id_fkey(${PHOTO_COLUMNS}), article_translations!inner(title)`,
    )
    .eq("article_translations.locale", ARTICLE_LOCALE)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load travel guides: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    title: row.article_translations[0]?.title ?? "",
    topic: row.topic,
    status: row.status,
    siteRegionId: row.site_region_id,
    authorId: row.author_id,
    publishedOn: row.published_on,
    isFeatured: row.is_featured,
    startHerePosition: row.start_here_position,
    updatedAt: row.updated_at,
    cover: row.cover ? toPhoto(row.cover) : null,
  }));
};

/** Everything the editor offers, in one go (`exceptArticleId`: the guide being edited, left out of "Keep reading"). */
export const getArticleOptions = async (exceptArticleId: string | null): Promise<ArticleOptions> => {
  const [sites, authors, rest, guides, photos] = await Promise.all([
    listSiteOptions(),
    listAuthorOptions(),
    listArticleOptions(exceptArticleId),
    listSectionGuides(),
    listLibraryPhotos(),
  ]);
  return { ...rest, sites, authors, guides, photos, regions: sites.map(({ id, name }) => ({ id, name })) };
};

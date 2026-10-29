import "server-only";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTICLE_LOCALE, FACT_ICON_VALUES } from "../constants";
import type { Article, ArticleFormValues } from "../types";
import { inOrder, storedMonths, storedSection, toStoredSection } from "./storedSections";

/** Postgres error codes the save can raise. */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const RULE_BROKEN = "22023";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

/** The rules save_article raises (errcode 22023), named in the error message. */
const RULES = ["author_language", "checker_not_allowed", "guest_needs_checker", "date_needed", "section_guide_not_agreed"] as const;
type ArticleRule = (typeof RULES)[number];

const ARTICLE_COLUMNS = `*,
  cover:photos!articles_cover_photo_id_fkey(${PHOTO_COLUMNS}),
  article_translations!inner(*, share:photos!article_translations_share_photo_id_fkey(${PHOTO_COLUMNS})),
  article_regions(region_id),
  article_related!article_related_article_id_fkey(related_article_id, position),
  article_sections(id, position, type, trek_id, settings, article_section_translations(locale, content),
    article_section_guides(guide_id, position), article_section_photos(photo_id, position))` as const;

/** Stored key facts as the form knows them; anything else (e.g. a removed icon) is dropped. */
const storedFactsSchema = z.array(z.object({ icon: z.enum(FACT_ICON_VALUES), label: z.string(), value: z.string() })).catch([]);

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

/** "As soon as I click Publish" unless a date not yet reached is set (then it goes live that day). */
const publishModeOf = (row: Pick<ArticleRow, "status" | "published_on">, today: string) =>
  row.published_on && (row.status !== "published" || row.published_on > today) ? "date" : "now";

/** One travel guide with its English text, or null when there is none with this id. `today`: "YYYY-MM-DD" in Nepal. */
export const getArticle = async (articleId: string, today: string): Promise<Article | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("id", articleId)
    .eq("article_translations.locale", ARTICLE_LOCALE)
    .maybeSingle();
  if (error) throw new Error(`Could not load travel guide ${articleId}: ${error.message}`);
  if (!row) return null;

  const [text] = row.article_translations;
  return {
    id: row.id,
    updatedAt: row.updated_at,
    updatedOn: row.updated_on,
    cover: row.cover ? toPhoto(row.cover) : null,
    sharePhoto: text?.share ? toPhoto(text.share) : null,
    title: text?.title ?? "",
    intro: text?.intro ?? "",
    cardText: text?.card_text ?? "",
    coverAlt: text?.cover_alt ?? "",
    photoTrekId: row.photo_trek_id,
    highlightTag: text?.highlight_tag ?? "",
    updatedLine: text?.updated_line ?? "",
    facts: storedFactsSchema.parse(text?.facts),
    siteRegionId: row.site_region_id,
    alsoOnMainSite: row.also_on_main_site,
    topic: row.topic,
    slug: row.slug,
    status: row.status,
    publishMode: publishModeOf(row, today),
    publishedOn: row.published_on,
    isFeatured: row.is_featured,
    startHerePosition: row.start_here_position,
    authorId: row.author_id,
    checkerGuideId: row.checker_guide_id,
    mainTrekId: row.main_trek_id,
    regionIds: row.article_regions.map((region) => region.region_id),
    relatedIds: [...row.article_related].sort((a, b) => a.position - b.position).map((item) => item.related_article_id),
    sections: [...row.article_sections]
      .sort((a, b) => a.position - b.position)
      .map((section) =>
        storedSection(
          { ...section, guideIds: inOrder(section.article_section_guides, "guide_id"), photoIds: inOrder(section.article_section_photos, "photo_id") },
          section.article_section_translations.find((text) => text.locale === ARTICLE_LOCALE)?.content,
        ),
      ),
    seoKeyword: text?.seo_keyword ?? "",
    seoTitle: text?.seo_title ?? "",
    seoDescription: text?.seo_description ?? "",
    canonicalPath: text?.canonical_path ?? "",
    hideFromGoogle: text?.hide_from_google ?? false,
    months: storedMonths(row.month_ratings, text?.month_notes),
  };
};

export type SaveArticleResult =
  | { ok: true; articleId: string }
  | { ok: false; reason: ArticleRule | "slug_taken" | "missing_link" | "not_found" | "forbidden" | "failed" };

const ruleOf = (message: string): ArticleRule | undefined => RULES.find((rule) => rule === message);

/** Adds (articleId null) or updates a travel guide, its English text, regions and related guides (save_article). */
export const saveArticle = async (values: ArticleFormValues, articleId: string | null): Promise<SaveArticleResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_article", {
    p_article_id: articleId,
    p_locale: ARTICLE_LOCALE,
    p_article: {
      site_region_id: values.siteRegionId ?? "",
      also_on_main_site: values.alsoOnMainSite,
      slug: values.slug,
      topic: values.topic,
      status: values.status,
      publish_mode: values.publishMode,
      published_on: values.publishedOn ?? "",
      is_big_update: values.isBigUpdate,
      is_featured: values.isFeatured,
      start_here_position: values.startHerePosition,
      author_id: values.authorId ?? "",
      checker_guide_id: values.checkerGuideId ?? "",
      main_trek_id: values.mainTrekId ?? "",
      photo_trek_id: values.photoTrekId ?? "",
      cover_photo_id: values.coverPhotoId ?? "",
      month_ratings: values.months.map((month) => month.rating),
    },
    p_text: {
      title: values.title,
      intro: values.intro,
      card_text: values.cardText,
      cover_alt: values.coverAlt,
      highlight_tag: values.highlightTag,
      updated_line: values.updatedLine,
      facts: values.facts,
      seo_keyword: values.seoKeyword,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
      share_photo_id: values.sharePhotoId ?? "",
      canonical_path: values.canonicalPath,
      hide_from_google: values.hideFromGoogle,
      month_notes: values.months.map(({ onTheTrail, crowds }) => ({ onTheTrail, crowds })),
    },
    p_region_ids: values.regionIds,
    // A guide never keeps reading into itself.
    p_related_ids: values.relatedIds.filter((id) => id !== articleId),
    p_sections: values.sections.map(toStoredSection),
  });

  if (!error) return { ok: true, articleId: data };
  const rule = error.code === RULE_BROKEN ? ruleOf(error.message) : undefined;
  if (rule) return { ok: false, reason: rule };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "slug_taken" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_link" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_article failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

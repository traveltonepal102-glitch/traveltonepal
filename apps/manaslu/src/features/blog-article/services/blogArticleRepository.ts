import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { getBlogsPage, listBlogPages } from "@/features/blogs/services/blogsRepository";
import { getHomeData } from "@/features/home/services/homeRepository";
import { getPageSeoOverrides } from "@/features/site-pages/services/pageSeoOverridesRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";
import { pagePath } from "@/lib/routes";

import { toBlogArticle } from "../blogArticleRows";
import type { BlogArticle } from "../types";

/**
 * A blog's page, or undefined when there is none. The address comes from the visitor, so it is first looked up among
 * this website's blogs: an unknown address reads nothing more. Throws when the database can't be read.
 */
export const getBlogArticle = async (slug: string): Promise<BlogArticle | undefined> => {
  "use cache";
  // Its trek cards and days are published treks, and its people come from Trekking guides.
  cacheTag(CACHE_TAGS.travelGuides, CACHE_TAGS.treks, CACHE_TAGS.trekkingGuides, CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  if (!(await listBlogPages()).some((blog) => blog.slug === slug)) return undefined;
  const [{ data: page, error }, home, { guides }, { hidden, canonicals }] = await Promise.all([
    createDatabaseClient().from("web_travel_guide_pages").select("*").eq("slug", slug).eq("locale", WEBSITE_LOCALE).maybeSingle(),
    getHomeData(),
    getBlogsPage(),
    getPageSeoOverrides(),
  ]);
  if (error) throw new Error(`Could not load the blog "${slug}": ${error.message}`);
  if (!page) return undefined;

  return toBlogArticle({
    page,
    treks: [...(home.trekCard ? [home.trekCard] : []), ...home.otherTreks],
    guides,
    photosBaseUrl: photosPublicBaseUrl,
    filesBaseUrl: trekFilesPublicBaseUrl,
    isLive: home.seo.isLive,
    isHidden: hidden.has(pagePath(slug)),
    canonicalPath: canonicals.get(pagePath(slug)),
  });
};

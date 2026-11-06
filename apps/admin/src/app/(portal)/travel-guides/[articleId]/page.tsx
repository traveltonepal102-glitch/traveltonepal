import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { saveArticle } from "@/features/travel-guides/actions/saveArticle";
import { ArticleEditor } from "@/features/travel-guides/components/editor/ArticleEditor";
import { TRAVEL_GUIDES_PATH } from "@/features/travel-guides/constants";
import { sectionPhotoIds } from "@/features/travel-guides/lib/sectionPhotoIds";
import { getArticleOptions } from "@/features/travel-guides/services/articleOptions";
import { getArticle } from "@/features/travel-guides/services/articlesRepository";
import { getFeedbackTotals } from "@/features/travel-guides/services/guideFeedbackRepository";
import { formatDateTime, todayInNepal } from "@/utils/formatDateTime";

type TravelGuidePageProps = PageProps<"/travel-guides/[articleId]">;

/** The guide, or a 404 for an id that isn't one (checked before asking the database). */
const loadArticle = async (params: TravelGuidePageProps["params"]) => {
  const { articleId } = await params;
  if (!z.uuid().safeParse(articleId).success) notFound();
  const article = await getArticle(articleId, todayInNepal());
  if (!article) notFound();
  return article;
};

export const generateMetadata = async ({ params }: TravelGuidePageProps): Promise<Metadata> => {
  await requireAdmin();
  return { title: (await loadArticle(params)).title };
};

/**
 * Edit a travel guide (design: Admin-article-editor.dc.html). "?added=1" right after it was added. A guide of another
 * website than "Working on" shows (e.g. after switching) goes back to this website's Travel guides.
 */
const TravelGuidePage = async ({ params, searchParams }: TravelGuidePageProps) => {
  await requireAdmin();
  const [article, site] = await Promise.all([loadArticle(params), getCurrentSite()]);
  if (!site || article.siteId !== site.id) redirect(TRAVEL_GUIDES_PATH);
  const [options, feedback, { added }] = await Promise.all([getArticleOptions(site, article.id, sectionPhotoIds(article.sections)), getFeedbackTotals(article.id), searchParams]);

  return (
    <ArticleEditor
      action={saveArticle.bind(null, article.siteId, article.id)}
      article={article}
      values={article}
      options={options}
      feedback={feedback}
      lastSaved={`Saved ${formatDateTime(article.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
    />
  );
};

export default TravelGuidePage;

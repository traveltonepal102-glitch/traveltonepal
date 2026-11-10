import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { deleteArticle } from "@/features/travel-guides/actions/deleteArticle";
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
 * website than "Working on" shows (e.g. after switching) goes back to this website's Travel guides. A Super admin also
 * gets "Delete".
 */
const TravelGuidePage = async ({ params, searchParams }: TravelGuidePageProps) => {
  const admin = await requireAdmin();
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
      headerActions={
        admin.role === "super_admin" && (
          <ConfirmRemoveButton
            verb="delete"
            name={article.title}
            consequence="Its page leaves the website, with its sections, files to download and reader feedback. Other guides stop linking to it. Library photos stay."
            action={deleteArticle.bind(null, article.siteId, article.id)}
          />
        )
      }
    />
  );
};

export default TravelGuidePage;

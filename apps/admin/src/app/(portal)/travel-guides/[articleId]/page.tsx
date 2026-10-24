import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveArticle } from "@/features/travel-guides/actions/saveArticle";
import { ArticleEditor } from "@/features/travel-guides/components/editor/ArticleEditor";
import { getArticleOptions } from "@/features/travel-guides/services/articleOptions";
import { getArticle } from "@/features/travel-guides/services/articlesRepository";
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

/** Edit a travel guide (design: Admin-article-editor.dc.html). "?added=1" right after it was added. */
const TravelGuidePage = async ({ params, searchParams }: TravelGuidePageProps) => {
  await requireAdmin();
  const article = await loadArticle(params);
  const [options, { added }] = await Promise.all([getArticleOptions(article.id), searchParams]);

  return (
    <ArticleEditor
      action={saveArticle.bind(null, article.id)}
      article={article}
      values={article}
      options={options}
      lastSaved={`Saved ${formatDateTime(article.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
    />
  );
};

export default TravelGuidePage;

import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveArticle } from "@/features/travel-guides/actions/saveArticle";
import { ArticleEditor } from "@/features/travel-guides/components/editor/ArticleEditor";
import { EMPTY_ARTICLE_VALUES } from "@/features/travel-guides/constants";
import { getArticleOptions } from "@/features/travel-guides/services/articleOptions";

export const metadata: Metadata = { title: "New travel guide" };

/** Add a travel guide (design: Admin-article-editor.dc.html). Saving opens it at its own address. */
const NewTravelGuidePage = async () => {
  await requireAdmin();
  const options = await getArticleOptions(null);

  return <ArticleEditor action={saveArticle.bind(null, null)} article={null} values={EMPTY_ARTICLE_VALUES} options={options} />;
};

export default NewTravelGuidePage;

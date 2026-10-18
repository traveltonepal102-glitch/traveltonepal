import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideArticlePage } from "@/features/guide-article/components/GuideArticlePage";
import { GUIDE_ARTICLE_SLUGS, getGuideArticle } from "@/features/guide-article/guideArticles";
import { articleMetadata } from "@/features/guide-article/seo";

type GuidePageProps = PageProps<"/travel-guides/[slug]">;

// Every guide with a page is prerendered at build time. Other slugs render on request and get a 404.
export const generateStaticParams = () => GUIDE_ARTICLE_SLUGS.map((slug) => ({ slug }));

// The slug is read before anything streams, so an unknown guide answers with a real 404 status.
// Reading it inside <Suspense> instead (Next's "instant navigation" advice) turns that into a
// 200 + noindex "soft 404", which search engines handle worse. Guides are prerendered, so blocking is cheap.
export const instant = false;

export const generateMetadata = async ({ params }: GuidePageProps): Promise<Metadata> => {
  const article = getGuideArticle((await params).slug);
  return article ? articleMetadata(article) : {};
};

const GuidePage = async ({ params }: GuidePageProps) => {
  const article = getGuideArticle((await params).slug);
  if (!article) notFound();

  return (
    <main className="flex-1 bg-page">
      <GuideArticlePage article={article} />
    </main>
  );
};

export default GuidePage;

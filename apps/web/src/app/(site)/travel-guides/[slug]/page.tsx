import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideArticlePage } from "@/features/guide-article/components/GuideArticlePage";
import { articleMetadata } from "@/features/guide-article/seo";
import { getGuideArticle, listGuidePageSlugs } from "@/features/guide-article/services/guidePageRepository";
import { listTravelGuides } from "@/features/guides/services/guidesRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { redirectIfMoved } from "@/features/seo/services/redirectsRepository";
import { withSiteShareImage } from "@/features/seo/withSiteShareImage";

type GuidePageProps = PageProps<"/travel-guides/[slug]">;

/** Cache Components needs at least one address to prerender; until a guide is published, this one (a 404). */
const NO_GUIDE_YET = "no-guide-yet";

// Every published guide is prerendered at build time; one published later renders on its first visit.
export const generateStaticParams = async () => {
  const slugs = await listGuidePageSlugs();
  return (slugs.length > 0 ? slugs : [NO_GUIDE_YET]).map((slug) => ({ slug }));
};

// The slug is read before anything streams, so an unknown guide answers with a real 404 status.
// Reading it inside <Suspense> instead (Next's "instant navigation" advice) turns that into a
// 200 + noindex "soft 404", which search engines handle worse. Guides are prerendered, so blocking is cheap.
export const instant = false;

export const generateMetadata = async ({ params }: GuidePageProps): Promise<Metadata> => {
  const article = await getGuideArticle((await params).slug);
  return withSiteShareImage(article ? articleMetadata(article) : {});
};

const GuidePage = async ({ params }: GuidePageProps) => {
  const { slug } = await params;
  const article = await getGuideArticle(slug);
  if (!article) {
    // An old address (the guide was renamed) moves on to today's; anything else is a 404.
    await redirectIfMoved("guide", slug);
    notFound();
  }
  const guides = await listTravelGuides();

  return (
    <main className="flex-1 bg-page">
      <PageSchemasJsonLd kind="guide" slug={slug} />
      <GuideArticlePage article={article} guides={guides} />
    </main>
  );
};

export default GuidePage;

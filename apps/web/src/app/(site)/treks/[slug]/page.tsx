import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteDefaults } from "@/features/seo/withSiteDefaults";
import { TrekDetailPage } from "@/features/trek-detail/components/TrekDetailPage";
import { trekMetadata } from "@/features/trek-detail/seo";
import { redirectIfMoved } from "@/features/seo/services/redirectsRepository";
import { getTrekDetail, listTrekPageSlugs } from "@/features/trek-detail/services/trekPageRepository";

type TrekPageProps = PageProps<"/treks/[slug]">;

/** Cache Components needs at least one address to prerender; until a trek has a page, this one (a 404). */
const NO_TREK_PAGE_YET = "no-trek-page-yet";

// Every trek with a page is prerendered at build time; one that gets its page later renders on its first visit.
export const generateStaticParams = async () => {
  const slugs = await listTrekPageSlugs();
  return (slugs.length > 0 ? slugs : [NO_TREK_PAGE_YET]).map((slug) => ({ slug }));
};

// A clicked link shows loading.tsx at once. A direct visit to an address not built yet waits for the finished
// page instead of streaming that skeleton (which would fix the status at 200), so an unknown trek answers a real
// 404 and a renamed one a real 308, also on the first visit.
export const ensureStatic = "navigation";
// Waiting is on purpose (see above), so the development check for "instant" navigation leaves this page alone.
export const instant = false;

export const generateMetadata = async ({ params }: TrekPageProps): Promise<Metadata> => {
  const trek = await getTrekDetail((await params).slug);
  return withSiteDefaults(trek ? trekMetadata(trek) : {});
};

const TrekPage = async ({ params }: TrekPageProps) => {
  const { slug } = await params;
  const trek = await getTrekDetail(slug);
  if (!trek) {
    // An old address (the trek was renamed) moves on to today's; anything else is a 404.
    await redirectIfMoved("trek", slug);
    notFound();
  }

  return (
    <main className="flex-1 bg-page">
      <PageSchemasJsonLd kind="trek" slug={slug} />
      <TrekDetailPage trek={trek} />
    </main>
  );
};

export default TrekPage;

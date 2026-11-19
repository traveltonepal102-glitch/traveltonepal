import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionDetailPage } from "@/features/region-detail/components/RegionDetailPage";
import { regionMetadata } from "@/features/region-detail/seo";
import { getRegionDetail, listRegionPageSlugs } from "@/features/region-detail/services/regionPageRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { redirectIfMoved } from "@/features/seo/services/redirectsRepository";
import { withSiteDefaults } from "@/features/seo/withSiteDefaults";

type RegionPageProps = PageProps<"/regions/[slug]">;

/** Cache Components needs at least one address to prerender; until a region has a page, this one (a 404). */
const NO_REGION_PAGE_YET = "no-region-page-yet";

// Every region with a page is prerendered at build time; one that gets its page later renders on its first visit.
export const generateStaticParams = async () => {
  const slugs = await listRegionPageSlugs();
  return (slugs.length > 0 ? slugs : [NO_REGION_PAGE_YET]).map((slug) => ({ slug }));
};

// A clicked link shows loading.tsx at once. A direct visit to an address not built yet waits for the finished
// page instead of streaming that skeleton (which would fix the status at 200), so an unknown region answers a real
// 404 and a renamed one a real 308, also on the first visit.
export const ensureStatic = "navigation";
// Waiting is on purpose (see above), so the development check for "instant" navigation leaves this page alone.
export const instant = false;

export const generateMetadata = async ({ params }: RegionPageProps): Promise<Metadata> => {
  const region = await getRegionDetail((await params).slug);
  return withSiteDefaults(region ? regionMetadata(region) : {});
};

const RegionPage = async ({ params }: RegionPageProps) => {
  const { slug } = await params;
  const region = await getRegionDetail(slug);
  if (!region) {
    // An old address (the region was renamed) moves on to today's; anything else is a 404.
    await redirectIfMoved("region", slug);
    notFound();
  }

  return (
    <main className="flex-1 bg-page">
      <PageSchemasJsonLd kind="region" slug={slug} />
      <RegionDetailPage region={region} />
    </main>
  );
};

export default RegionPage;

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionDetailPage } from "@/features/region-detail/components/RegionDetailPage";
import { regionMetadata } from "@/features/region-detail/seo";
import { getRegionDetail, listRegionPageSlugs } from "@/features/region-detail/services/regionPageRepository";

type RegionPageProps = PageProps<"/regions/[slug]">;

/** Cache Components needs at least one address to prerender; until a region has a page, this one (a 404). */
const NO_REGION_PAGE_YET = "no-region-page-yet";

// Every region with a page is prerendered at build time; one that gets its page later renders on its first visit.
export const generateStaticParams = async () => {
  const slugs = await listRegionPageSlugs();
  return (slugs.length > 0 ? slugs : [NO_REGION_PAGE_YET]).map((slug) => ({ slug }));
};

// The slug is read before anything streams, so an unknown region answers with a real 404 status.
// Reading it inside <Suspense> instead (Next's "instant navigation" advice) turns that into a
// 200 + noindex "soft 404", which search engines handle worse. Regions are prerendered, so blocking is cheap.
export const instant = false;

export const generateMetadata = async ({ params }: RegionPageProps): Promise<Metadata> => {
  const region = await getRegionDetail((await params).slug);
  return region ? regionMetadata(region) : {};
};

const RegionPage = async ({ params }: RegionPageProps) => {
  const region = await getRegionDetail((await params).slug);
  if (!region) notFound();

  return (
    <main className="flex-1 bg-page">
      <RegionDetailPage region={region} />
    </main>
  );
};

export default RegionPage;

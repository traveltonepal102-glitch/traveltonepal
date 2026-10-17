import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionDetailPage } from "@/features/region-detail/components/RegionDetailPage";
import { REGION_DETAIL_SLUGS, getRegionDetail } from "@/features/region-detail/regionDetails";
import { regionMetadata } from "@/features/region-detail/seo";

type RegionPageProps = PageProps<"/regions/[slug]">;

// Every region with a page is prerendered at build time. Other slugs render on request and get a 404.
export const generateStaticParams = () => REGION_DETAIL_SLUGS.map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: RegionPageProps): Promise<Metadata> => {
  const region = getRegionDetail((await params).slug);
  return region ? regionMetadata(region) : {};
};

const RegionPage = async ({ params }: RegionPageProps) => {
  const region = getRegionDetail((await params).slug);
  if (!region) notFound();

  return (
    <main className="flex-1 bg-page">
      <RegionDetailPage region={region} />
    </main>
  );
};

export default RegionPage;

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrekDetailPage } from "@/features/trek-detail/components/TrekDetailPage";
import { trekMetadata } from "@/features/trek-detail/seo";
import { TREK_DETAIL_SLUGS, getTrekDetail } from "@/features/trek-detail/trekDetails";

type TrekPageProps = PageProps<"/treks/[slug]">;

// Every trek with a page is prerendered at build time. Other slugs render on request and get a 404.
export const generateStaticParams = () => TREK_DETAIL_SLUGS.map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: TrekPageProps): Promise<Metadata> => {
  const trek = getTrekDetail((await params).slug);
  return trek ? trekMetadata(trek) : {};
};

const TrekPage = async ({ params }: TrekPageProps) => {
  const trek = getTrekDetail((await params).slug);
  if (!trek) notFound();

  return (
    <main className="flex-1 bg-page">
      <TrekDetailPage trek={trek} />
    </main>
  );
};

export default TrekPage;

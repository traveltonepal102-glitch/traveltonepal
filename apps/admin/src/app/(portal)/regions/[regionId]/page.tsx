import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveRegion } from "@/features/regions/actions/saveRegion";
import { RegionEditor } from "@/features/regions/components/editor/RegionEditor";
import { getRegion } from "@/features/regions/services/regionsRepository";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
import { formatDateTime, todayInNepal } from "@/utils/formatDateTime";

type RegionPageProps = PageProps<"/regions/[regionId]">;

/** The region, or a 404 for an id that isn't a region (checked before asking the database). */
const loadRegion = async (params: RegionPageProps["params"]) => {
  const { regionId } = await params;
  if (!z.uuid().safeParse(regionId).success) notFound();
  const region = await getRegion(regionId);
  if (!region) notFound();
  return region;
};

export const generateMetadata = async ({ params }: RegionPageProps): Promise<Metadata> => {
  await requireAdmin();
  const region = await loadRegion(params);
  return { title: `${region.name} region` };
};

/** Edit a region (design: Admin-region-editor.dc.html). "?added=1" right after it was added. */
const RegionPage = async ({ params, searchParams }: RegionPageProps) => {
  await requireAdmin();
  const [region, treks, guides, { added }] = await Promise.all([loadRegion(params), listSimilarTrekOptions(null), listTrekkingGuides(), searchParams]);
  const today = todayInNepal();

  return (
    <RegionEditor
      action={saveRegion.bind(null, region.id)}
      values={region}
      photos={region.photos}
      regionId={region.id}
      isNew={false}
      websiteDomain={region.websiteDomain}
      regionTreks={treks.filter((trek) => trek.regionId === region.id)}
      otherTreks={treks.filter((trek) => trek.regionId !== region.id)}
      guides={guides.filter((guide) => guide.regionIds.includes(region.id)).map((guide) => toGuideOption(guide, today))}
      lastSaved={`Saved ${formatDateTime(region.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
    />
  );
};

export default RegionPage;

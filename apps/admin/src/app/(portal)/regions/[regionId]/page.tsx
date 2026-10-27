import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { deleteRegion } from "@/features/regions/actions/deleteRegion";
import { saveRegion } from "@/features/regions/actions/saveRegion";
import { RegionEditor } from "@/features/regions/components/editor/RegionEditor";
import { toRegionBlockers } from "@/features/regions/lib/regionBlockers";
import { getRegion, getRegionUsage } from "@/features/regions/services/regionsRepository";
import { listRegionArticles } from "@/features/travel-guides/services/articleOptions";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { listRegionOptions, listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
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

/**
 * Edit a region (design: Admin-region-editor.dc.html). "?added=1" right after it was added. A Super admin also gets
 * "Delete", which lists what still uses the region instead while anything does.
 */
const RegionPage = async ({ params, searchParams }: RegionPageProps) => {
  const admin = await requireAdmin();
  const canDelete = admin.role === "super_admin";
  const [region, treks, guides, regions, { added }] = await Promise.all([
    loadRegion(params),
    listSimilarTrekOptions(null),
    listTrekkingGuides(),
    listRegionOptions(),
    searchParams,
  ]);
  const [articles, usage] = await Promise.all([listRegionArticles(region.id), canDelete ? getRegionUsage(region.id) : []]);
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
      otherRegions={regions.filter((other) => other.id !== region.id)}
      guides={guides.filter((guide) => guide.regionIds.includes(region.id)).map((guide) => toGuideOption(guide, today))}
      articles={articles}
      today={today}
      lastSaved={`Saved ${formatDateTime(region.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
      headerActions={
        canDelete && (
          <ConfirmRemoveButton
            verb="delete"
            name={`${region.name} region`}
            consequence="Its page leaves the website, with its text, best months, questions and gallery. Library photos stay."
            action={deleteRegion.bind(null, region.id)}
            blockers={toRegionBlockers(usage)}
          />
        )
      }
    />
  );
};

export default RegionPage;

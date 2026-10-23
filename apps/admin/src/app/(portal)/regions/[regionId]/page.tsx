import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveRegion } from "@/features/regions/actions/saveRegion";
import { RegionEditor } from "@/features/regions/components/editor/RegionEditor";
import { getRegion } from "@/features/regions/services/regionsRepository";
import { formatDateTime } from "@/utils/formatDateTime";

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
  const region = await loadRegion(params);
  const { added } = await searchParams;

  return (
    <RegionEditor
      action={saveRegion.bind(null, region.id)}
      values={region}
      photos={region.photos}
      regionId={region.id}
      isNew={false}
      websiteDomain={region.websiteDomain}
      lastSaved={`Saved ${formatDateTime(region.updatedAt)}`}
      isJustAdded={added === "1"}
    />
  );
};

export default RegionPage;

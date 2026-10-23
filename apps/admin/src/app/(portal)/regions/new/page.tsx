import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveRegion } from "@/features/regions/actions/saveRegion";
import { RegionEditor } from "@/features/regions/components/editor/RegionEditor";
import { EMPTY_REGION_VALUES, NO_REGION_PHOTOS, REGIONS_PATH } from "@/features/regions/constants";
import { listSimilarTrekOptions } from "@/features/treks/services/treksRepository";

export const metadata: Metadata = { title: "New region" };

/** Add a region: the region editor, empty. Saving creates it and opens it. Super admins only (also enforced by RLS). */
const NewRegionPage = async () => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") redirect(REGIONS_PATH);
  // A new region has no treks or guides of its own yet; every trek can be suggested as nearby.
  const treks = await listSimilarTrekOptions(null);

  return (
    <RegionEditor
      action={saveRegion.bind(null, null)}
      values={EMPTY_REGION_VALUES}
      photos={NO_REGION_PHOTOS}
      regionId={null}
      isNew
      websiteDomain={null}
      regionTreks={[]}
      otherTreks={treks}
      guides={[]}
    />
  );
};

export default NewRegionPage;

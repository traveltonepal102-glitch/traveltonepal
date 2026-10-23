import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { RegionsOverview } from "@/features/regions/components/list/RegionsOverview";
import { toRegionCardItem } from "@/features/regions/lib/regionCard";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.regions.label };

/** Regions list (design: Admin-regions.dc.html). Only a Super admin sees "Add region". */
const RegionsPage = async () => {
  const admin = await requireAdmin();
  const regions = await listRegions();

  return <RegionsOverview regions={regions.map(toRegionCardItem)} canAddRegion={admin.role === "super_admin"} />;
};

export default RegionsPage;

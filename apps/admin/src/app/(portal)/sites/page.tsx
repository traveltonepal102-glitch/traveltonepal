import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { SitesList } from "@/features/sites/components/SitesList";
import { SAVED_NOTICES } from "@/features/sites/constants";
import { listSites } from "@/features/sites/services/sitesRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.sites.label };

/** Sites: every website of the network. "?saved=added" says a site was just added. */
const SitesPage = async ({ searchParams }: PageProps<"/sites">) => {
  const admin = await requireAdmin();
  const [sites, regions, { saved }] = await Promise.all([listSites(), listRegions(), searchParams]);
  const savedNotice = Object.entries(SAVED_NOTICES).find(([notice]) => notice === saved)?.[1] ?? null;

  return (
    <SitesList
      sites={sites}
      regionNames={Object.fromEntries(regions.map((region) => [region.id, region.name]))}
      canAddSite={admin.role === "super_admin"}
      savedNotice={savedNotice}
    />
  );
};

export default SitesPage;

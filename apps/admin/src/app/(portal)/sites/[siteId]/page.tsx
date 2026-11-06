import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { saveSite } from "@/features/sites/actions/saveSite";
import { DeleteSiteCard } from "@/features/sites/components/DeleteSiteCard";
import { EditSiteForm } from "@/features/sites/components/EditSiteForm";
import { listSites } from "@/features/sites/services/sitesRepository";

export const metadata: Metadata = { title: "Edit site" };

/** A site's page: edit its name, address and Live switch; Super admins delete a draft region site here. */
const SitePage = async ({ params }: PageProps<"/sites/[siteId]">) => {
  const admin = await requireAdmin();
  const [{ siteId }, sites, regions] = await Promise.all([params, listSites(), listRegions()]);
  const site = sites.find((item) => item.id === siteId);
  if (!site) notFound();

  const isSuperAdmin = admin.role === "super_admin";
  const regionName = regions.find((region) => region.id === site.regionId)?.name ?? null;

  return (
    <div className="flex max-w-240 flex-col gap-5">
      <EditSiteForm action={saveSite.bind(null, site.id)} site={site} regionName={regionName} canEdit={isSuperAdmin} />
      {isSuperAdmin && <DeleteSiteCard site={site} />}
    </div>
  );
};

export default SitePage;

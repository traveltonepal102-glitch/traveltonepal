import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { addSite } from "@/features/sites/actions/addSite";
import { AddSiteForm } from "@/features/sites/components/AddSiteForm";
import { SITES_PATH } from "@/features/sites/constants";
import { listSites } from "@/features/sites/services/sitesRepository";

export const metadata: Metadata = { title: "Add a site" };

/** Add a site: a new region website (Super admins only; others go back to Sites). */
const NewSitePage = async () => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") redirect(SITES_PATH);

  const [sites, regions] = await Promise.all([listSites(), listRegions()]);
  const taken = new Set(sites.map((site) => site.regionId));
  const options = regions.filter((region) => !taken.has(region.id)).map((region) => ({ value: region.id, label: region.name }));

  return <AddSiteForm action={addSite} regions={options} />;
};

export default NewSitePage;

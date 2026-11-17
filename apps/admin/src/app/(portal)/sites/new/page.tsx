import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { addSite } from "@/features/sites/actions/addSite";
import { AddSiteForm } from "@/features/sites/components/AddSiteForm";
import { SITES_PATH } from "@/features/sites/constants";

export const metadata: Metadata = { title: "Add a site" };

/** Add a site: a new region website (Super admins only; others go back to Sites). */
const NewSitePage = async () => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") redirect(SITES_PATH);

  // A region may have more than one website (Nar Phu Trek is a valley of the Annapurna region): every region can be picked.
  const regions = await listRegions();
  const options = regions.map((region) => ({ value: region.id, label: region.name }));

  return <AddSiteForm action={addSite} regions={options} />;
};

export default NewSitePage;

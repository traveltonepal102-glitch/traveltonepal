import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { WorkInProgress } from "@/components/shared/WorkInProgress";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.dashboard.label };

/** Placeholder until the dashboard is built (design: Admin-dashboard.dc.html). */
const DashboardPage = async () => {
  const admin = await requireAdmin();
  const firstName = admin.full_name.split(" ")[0] || admin.email;

  return (
    <>
      <PageHeader title={`Namaste, ${firstName}`} description={ADMIN_SECTIONS.dashboard.summary} />
      <WorkInProgress />
    </>
  );
};

export default DashboardPage;

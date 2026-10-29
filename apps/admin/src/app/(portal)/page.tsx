import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { WorkInProgress } from "@/components/shared/WorkInProgress";
import { env } from "@/env";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ContactClicksCard } from "@/features/dashboard/components/ContactClicksCard";
import { getContactClicks } from "@/features/dashboard/services/contactClicksRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.dashboard.label };

/** How far back the WhatsApp and email clicks go. */
const CLICK_DAYS = 30;

/** The dashboard (design: Admin-dashboard.dc.html): the website's button clicks now, the rest still to come. */
const DashboardPage = async () => {
  const admin = await requireAdmin();
  const firstName = admin.full_name.split(" ")[0] || admin.email;
  const clicks = await getContactClicks(CLICK_DAYS);

  return (
    <>
      <PageHeader title={`Namaste, ${firstName}`} description={ADMIN_SECTIONS.dashboard.summary} />
      <ContactClicksCard summary={clicks} days={CLICK_DAYS} websiteUrl={env.WEBSITE_URL?.replace(/\/+$/, "") ?? null} />
      <WorkInProgress />
    </>
  );
};

export default DashboardPage;

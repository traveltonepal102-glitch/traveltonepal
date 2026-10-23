import { cookies } from "next/headers";

import { env } from "@/env";
import { ROLE_LABELS } from "@/features/auth/constants";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { AdminShell } from "@/features/shell/components/AdminShell";
import { SidebarUser } from "@/features/shell/components/SidebarUser";
import { RAIL_COOKIE } from "@/features/shell/constants";

/**
 * Every signed-in screen, inside the admin shell (sidebar and top bar). Layouts don't run again on every
 * navigation, so each page and Server Action under here calls requireAdmin() too; this check decides
 * what the sidebar shows.
 */
const PortalLayout = async ({ children }: LayoutProps<"/">) => {
  const admin = await requireAdmin();
  const isRail = (await cookies()).get(RAIL_COOKIE)?.value === "1";

  return (
    <AdminShell
      isRailInitially={isRail}
      websiteUrl={env.WEBSITE_URL}
      user={<SidebarUser name={admin.full_name || admin.email} roleLabel={ROLE_LABELS[admin.role]} />}
    >
      {children}
    </AdminShell>
  );
};

export default PortalLayout;

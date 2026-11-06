import { cookies } from "next/headers";

import { PhotosBaseUrlProvider } from "@/components/ui/richText/PhotosBaseUrl";
import { env } from "@/env";
import { ROLE_LABELS } from "@/features/auth/constants";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { AdminShell } from "@/features/shell/components/AdminShell";
import { SidebarUser } from "@/features/shell/components/SidebarUser";
import { SiteSwitcher } from "@/features/shell/components/SiteSwitcher";
import { RAIL_COOKIE } from "@/features/shell/constants";
import { newItemsFor } from "@/features/shell/newItems";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { listSites } from "@/features/sites/services/sitesRepository";
import { photosPublicBaseUrl } from "@/lib/storage/photoOrigins";

/**
 * Every signed-in screen, inside the admin shell (sidebar and top bar). Layouts don't run again on every
 * navigation, so each page and Server Action under here calls requireAdmin() too; this check decides
 * what the sidebar shows.
 */
const PortalLayout = async ({ children }: LayoutProps<"/">) => {
  const admin = await requireAdmin();
  const [cookieStore, sites, currentSite] = await Promise.all([cookies(), listSites(), getCurrentSite()]);
  const isRail = cookieStore.get(RAIL_COOKIE)?.value === "1";

  return (
    <AdminShell
      isRailInitially={isRail}
      websiteUrl={env.WEBSITE_URL}
      newItems={newItemsFor(admin.role)}
      siteKind={currentSite?.kind ?? "main"}
      siteSwitcher={
        currentSite && (
          <SiteSwitcher
            sites={sites.map(({ id, kind, name, url, isLive }) => ({ id, kind, name, url, isLive }))}
            currentSiteId={currentSite.id}
            canAddSite={admin.role === "super_admin"}
          />
        )
      }
      user={<SidebarUser name={admin.full_name || admin.email} roleLabel={ROLE_LABELS[admin.role]} />}
    >
      {/* The text editors show the photos added in a text from here. */}
      <PhotosBaseUrlProvider value={photosPublicBaseUrl}>{children}</PhotosBaseUrlProvider>
    </AdminShell>
  );
};

export default PortalLayout;

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listPagePath } from "@/features/pages/constants";
import { getSitePage } from "@/features/pages/services/pagesRepository";
import { saveRegionHome } from "@/features/region-home/actions/saveRegionHome";
import { RegionHomeEditor } from "@/features/region-home/components/RegionHomeEditor";
import { toHomeTopContent } from "@/features/region-home/lib/homeTopContent";
import { listHomeTrekOptions } from "@/features/region-home/services/regionHomeRepository";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: "Home page" };

/** A region website's Home: its main trek, the top of the page and the Google result. The main site's Home is edited with the list pages. */
const RegionHomePage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  if (site.kind !== "region") redirect(listPagePath("home"));

  const [page, treks] = await Promise.all([getSitePage(site.id, "home"), listHomeTrekOptions(site.id)]);
  // Every site has its Home row (made with the site); a missing one is a broken site.
  if (!page) notFound();

  return (
    <RegionHomeEditor
      // A different site's Home is a different form: start it afresh.
      key={site.id}
      action={saveRegionHome.bind(null, site.id)}
      siteName={site.name}
      regionId={site.regionId}
      treks={treks}
      homeTrekId={site.homeTrekId}
      top={{ ...page.top, ...toHomeTopContent(page.content) }}
      photo={page.photo}
      sharePhoto={page.sharePhoto}
      lastSaved={`Published · saved ${formatDateTime(page.updatedAt)} Nepal time`}
    />
  );
};

export default RegionHomePage;

import { MAIN_SITE_ID } from "@ttn/config/sites";
import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { copyTrek } from "@/features/treks/actions/copyTrek";
import { TreksOverview } from "@/features/treks/components/list/TreksOverview";
import { toTrekListItem } from "@/features/treks/lib/trekListItem";
import { listRegionOptions, listSimilarTrekOptions, listTreks } from "@/features/treks/services/treksRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.treks.label };

/** Treks list of the website "Working on" shows (design: Admin-treks.dc.html); a region website can also copy one from Travel To Nepal. */
const TreksPage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [treks, regions, copyOptions] = await Promise.all([listTreks(site.id), listRegionOptions(), site.kind === "region" ? listSimilarTrekOptions(MAIN_SITE_ID, null) : null]);
  const copy = copyOptions && { options: copyOptions, regionId: site.regionId, action: copyTrek.bind(null, site.id) };

  return <TreksOverview siteName={site.name} treks={treks.map(toTrekListItem)} regions={regions} copy={copy} />;
};

export default TreksPage;

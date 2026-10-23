import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { TreksOverview } from "@/features/treks/components/list/TreksOverview";
import { toTrekListItem } from "@/features/treks/lib/trekListItem";
import { listRegionOptions, listTreks } from "@/features/treks/services/treksRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.treks.label };

/** Treks list (design: Admin-treks.dc.html). */
const TreksPage = async () => {
  await requireAdmin();
  const [treks, regions] = await Promise.all([listTreks(), listRegionOptions()]);

  return <TreksOverview treks={treks.map(toTrekListItem)} regions={regions} />;
};

export default TreksPage;

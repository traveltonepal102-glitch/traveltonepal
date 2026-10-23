import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { saveTrekkingGuide } from "@/features/trekking-guides/actions/saveTrekkingGuide";
import { GuidePanel } from "@/features/trekking-guides/components/editor/GuidePanel";
import { GuidesOverview } from "@/features/trekking-guides/components/list/GuidesOverview";
import { EMPTY_GUIDE_VALUES } from "@/features/trekking-guides/constants";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { listRegionOptions } from "@/features/treks/services/treksRepository";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.trekkingGuides.label };

/**
 * Trekking guides (design: Admin-people.dc.html). "?guide=<id>" opens a guide's edit panel beside the list,
 * "?guide=new" an empty one; "&added=1" right after adding.
 */
const TrekkingGuidesPage = async ({ searchParams }: PageProps<"/trekking-guides">) => {
  const admin = await requireAdmin();
  const [guides, regions, { guide: openParam, added }] = await Promise.all([listTrekkingGuides(), listRegionOptions(), searchParams]);
  const today = todayInNepal();

  const openId = typeof openParam === "string" ? openParam : null;
  const open = guides.find((guide) => guide.id === openId) ?? null;
  const isAdding = openId === "new";

  const panel = (open || isAdding) && (
    <GuidePanel
      // A fresh form for each guide (nothing typed for one guide carries over to another).
      key={open?.id ?? "new"}
      action={saveTrekkingGuide.bind(null, open?.id ?? null)}
      guide={open}
      values={open ?? EMPTY_GUIDE_VALUES}
      regions={regions}
      today={today}
      canRemove={admin.role === "super_admin"}
      isJustAdded={added === "1"}
    />
  );

  return <GuidesOverview guides={guides} regions={regions} openId={open?.id ?? (isAdding ? "new" : null)} today={today} panel={panel || null} />;
};

export default TrekkingGuidesPage;
